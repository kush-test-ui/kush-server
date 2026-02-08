const crypto = require('crypto');


const generatePayload = ({ order_id, status, customer, amount, updatedProducts }) => {
  return `
<b>Замовлення №:</b> ${order_id}
<b>Cтатус: </b> ${status}
<b>Покупець:</b> ${customer.firstName} ${customer.lastName}
<b>Номер телефону:</b> +${customer.phone}
<b>Пошта:</b> ${customer.email}
<b>Товар:</b>${updatedProducts.map(({ name, size, material }) =>
`${name}\n${size ? `<b>Розмір:</b> ${size}\n` : ''}${material ? `<b>Матеріал:</b> ${material}` : ''}`).join('')}
<b>Cума оплати:</b> ${amount} грн.
<b>Доставка:</b> ${
  customer.self_delivery
    ? 'Самовивіз'
    : `\n<b>Місто:</b> ${customer.customer_city}\n<b>Відділення:</b> ${customer.customer_warehouse}`
  }`;
}

const postTelegramNotification = async ({ order_id, status, customer, amount, updatedProducts }) => {
  await fetch(
    `https://api.telegram.org/bot${process.env.TG_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: `${process.env.TG_CHAT_ORDER_ID}`,
        parse_mode: 'HTML',
        text: generatePayload({ order_id, status, customer, amount, updatedProducts }),
      }),
    }
  );
}

module.exports = {
  async create(ctx) {
    const public_key = 'i85549703498';
    const private_key = 'CT9i3VSrVlUaDxuKlGZEj5HHRtC6JWHK2gg9SP2P';

    const {
      amount,
      currency,
      description,
      order_id,
      shop_name,
      rro_info,
      customer,
    } = ctx.request.body;

    const data = Buffer.from(
      JSON.stringify({
        amount,
        version: '3',
        currency,
        order_id,
        rro_info,
        shop_name,
        public_key,
        description,
        action: 'pay',
        server_url: 'https://api.kush.jewelry/api/payment/callback',
        result_url: 'https://www.kush.jewelry/uk/?checkout=success',
        sender_first_name: customer.firstName,
        sender_last_name: customer.lastName,
        sender_city: customer.city,
        sender_address: customer.warehouse,
        sender_email: customer.email,
        sender_phone: customer.phone,
      })
    ).toString('base64');
    

    const signature = crypto
      .createHash('sha1')
      .update(private_key + data + private_key)
      .digest('base64');

    return ctx.send({ data, signature });
  },

  async callback(ctx) {
    if (ctx.request.method === 'POST') {
      const private_key = 'n6JKQIKKGswTTgKhRcsaP9L0O6L8J5fXAL6FT6sZ';
      

      const { data, signature, userId, products, customer } = ctx.request.body;

      if (!data || !signature) {
        return ctx.send({ status: 400, message: 'Missing required fields' });
      }

      const expectedSignature = crypto
        .createHash('sha1')
        .update(private_key + data + private_key)
        .digest('base64');

      if (signature !== expectedSignature) {
        return ctx.send({ status: 400, message: 'Invalid signature' });
      }

      const decodedData = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'));
      const { order_id, status, amount } = decodedData;

      // Визначаємо пріоритет статусів
      const statusPriority = {
        'success': 3,
        'wait_secure': 2,
        'failure': 1,
        'error': 1,
        'try_again': 1
      };

      // Перевіряємо існуюче замовлення
      const existingOrder = await strapi
        .query('api::order.order')
        .findOne({
          where: { paymentIntentID: order_id },
        });

      // Якщо замовлення існує
      if (existingOrder) {
        const currentPriority = statusPriority[existingOrder.status] || 0;
        const newPriority = statusPriority[status] || 0;

        // Оновлюємо тільки якщо новий статус має вищий пріоритет
        if (newPriority > currentPriority) {
          try {
            const updatedProducts = products.map((product) => ({ ...product, status }));
            
            const updatedOrder = await strapi.query('api::order.order').update({
              where: { id: existingOrder.id },
              data: {
                status,
                products: updatedProducts,
              },
            });

            // Відправляємо повідомлення в Telegram тільки при успішній оплаті
            if (status === 'success') {
              await postTelegramNotification({ order_id, status, customer, amount, updatedProducts });
            }

            return ctx.send({
              status: 200,
              order: updatedOrder,
              message: 'Order updated successfully',
            });
          } catch (error) {
            console.error('Error updating order:', error);
            return ctx.send({ status: 500, message: 'Error updating order' });
          }
        }

        return ctx.send({
          status: 200,
          order: existingOrder,
          message: 'Order already exists with same or higher priority status',
        });
      }

      if (!['error', 'failure', 'try_again'].includes(status)) {
        try {
          const updatedProducts = products.map((product) => ({ ...product, status }));
          
          const order = await strapi.query('api::order.order').create({
            data: {
              user: userId ? { connect: { id: userId } } : null,
              amount,
              status,
              paymentIntentID: order_id,
              products: updatedProducts,
              customer_firstName: customer.firstName,
              customer_lastName: customer.lastName,
              customer_email: customer.email,
              customer_phone: customer.phone,
              customer_city: customer.customer_city,
              customer_warehouse: customer.customer_warehouse,
              publishedAt: new Date(),
              self_delivery: customer.self_delivery,
            },
          });

          await postTelegramNotification({ order_id, status, customer, amount, updatedProducts });
          
          return ctx.send({
            status: 200,
            order: order,
            message: 'Transaction complete',
          });
        } catch (error) {
          return ctx.send({ status: 500, message: 'Internal Server Error' });
        }
      }

      return ctx.send({
        status: 204,
        order: null,
        message: status,
      });
    }
  },
};
