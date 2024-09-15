'use strict';

/**
 * A set of functions called "actions" for `payment`
 */

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
      products,
      userId,
      customer,
    } = ctx.request.body;

    const public_key = process.env.LIQPAY_PUBLIC_KEY || 'sandbox_i2714471428';
    const private_key =
      process.env.LIQPAY_PRIVATE_KEY ||
      'sandbox_YKxKymXMrPDRj8m1pG9wkWdV8tY9YEnAHdg0K9Nk';
    const version = '3';

    await strapi.query('api::order.order').create({
      data: {
        amount,
        products,
        currency,
        user: userId,
        status: 'pending',
        customer_firstName: customer.firstName,
        customer_lastName: customer.lastName,
        customer_email: customer.email,
        customer_phone: customer.phone,
        customer_delivery: customer.delivery,
        paymentIntentID: order_id,
      },
    });

    const server_url = `${ctx.request.protocol}://${ctx.request.host}/api/payment/callback`;

    const data = Buffer.from(
      JSON.stringify({
        version,
        public_key,
        action: 'pay',
        amount,
        currency,
        description,
        order_id,
        shop_name,
        rro_info,
        server_url,
        sender_first_name: customer.firstName,
        sender_last_name: customer.lastName,
        sender_email: customer.email,
        sender_phone: customer.phone,
        sandbox: '1',
      })
    ).toString('base64');

    const signature = crypto
      .createHash('sha1')
      .update(private_key + data + private_key)
      .digest('base64');

    return ctx.send({ data, signature, server_url });
  },

  async callback(ctx) {
    if (ctx.request.method === 'POST') {
      const { data, signature } = ctx.request.body;

      const private_key =
        process.env.LIQPAY_PRIVATE_KEY ||
        'sandbox_YKxKymXMrPDRj8m1pG9wkWdV8tY9YEnAHdg0K9Nk';

      const expectedSignature = crypto
        .createHash('sha1')
        .update(private_key + data + private_key)
        .digest('base64');

      if (signature !== expectedSignature) {
        return ctx.send({ status: 400, message: 'Invalid signature' });
      }

      const decodedData = JSON.parse(
        Buffer.from(data, 'base64').toString('utf-8')
      );

      const { order_id, status } = decodedData;

      let orderStatus;

      switch (status) {
        case 'success':
          orderStatus = 'completed';
          break;
        case 'failure':
          orderStatus = 'failed';
          break;
        case 'sandbox':
          orderStatus = 'sandbox';
          break;
        default:
          orderStatus = 'unknown';
      }

      const updatedOrder = await strapi.query('api::order.order').update({
        where: { paymentIntentID: order_id },
        data: { status: orderStatus },
      });

      return ctx.send({
        status: 200,
        message: 'Transaction complete',
        order: updatedOrder,
      });
    } else {
      return ctx.send({ status: 405, message: 'Method not allowed' });
    }
  },
};
