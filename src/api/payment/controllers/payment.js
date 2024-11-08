const crypto = require('crypto');

module.exports = {
  async create(ctx) {
    const {
      amount,
      currency,
      description,
      order_id,
      shop_name,
      rro_info,
      customer,
    } = ctx.request.body;

    const public_key = 'i85549703498';
    const private_key = 'CT9i3VSrVlUaDxuKlGZEj5HHRtC6JWHK2gg9SP2P';

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
      const { data, signature, userId, products, customer } = ctx.request.body;

      const private_key = 'CT9i3VSrVlUaDxuKlGZEj5HHRtC6JWHK2gg9SP2P';

      const expectedSignature = crypto
        .createHash('sha1')
        .update(private_key + data + private_key)
        .digest('base64');

      const decodedData = JSON.parse(
        Buffer.from(data, 'base64').toString('utf-8')
      );

      if (signature !== expectedSignature) {
        return ctx.send({ status: 400, message: 'Invalid signature' });
      }

      const { order_id, status, amount } = decodedData;

      const updatedProducts = products.map((product) => ({
        ...product,
        status,
      }));

      const existingCurrentOrder = await strapi
        .query('api::order.order')
        .findOne({
          where: { paymentIntentID: order_id },
        });

      if (existingCurrentOrder) {
        return ctx.send({
          status: 200,
          order: existingCurrentOrder,
          message: 'Transaction complete',
        });
      }

      try {
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
            customer_city: customer.city,
            customer_warehouse: customer.warehouse,
            publishedAt: new Date(),
            self_delivery: customer.self,
          },
        });

        const payload = `
<b>Замовлення №:</b> ${order_id}
<b>Покупець:</b> ${customer.firstName} ${customer.lastName}
<b>Пошта:</b> ${customer.email}
<b>Номер телефону: ${customer.phone}</b>
<b>Продукція:</b> ${updatedProducts.map(({ name }) => name).join(', ')}
<b>Cума оплати: </b> ${amount}грн.
<b>Доставити:</b> ${
          customer.self
            ? 'Caмовивіз'
            : `М. ${customer.customer_city}, ${customer.customer_warehouse}`
        }
`;

        await fetch(
          `https://api.telegram.org/bot${process.env.TG_TOKEN}/sendMessage`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: `${process.env.TG_CHAT_ORDER_ID}`,
              parse_mode: 'HTML',
              text: payload,
            }),
          }
        );

        return ctx.send({
          status: 200,
          order: order,
          message: 'Transaction complete',
        });
      } catch (error) {
        return ctx.send({ status: 500, message: 'Internal Server Error' });
      }
    }
  },
};
