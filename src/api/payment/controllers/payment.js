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
      customer,
    } = ctx.request.body;

    const public_key = process.env.LIQPAY_PUBLIC_KEY || 'sandbox_i2714471428';

    const private_key =
      process.env.LIQPAY_PRIVATE_KEY ||
      'sandbox_YKxKymXMrPDRj8m1pG9wkWdV8tY9YEnAHdg0K9Nk';
    const version = '3';

    const data = Buffer.from(
      JSON.stringify({
        amount,
        version,
        currency,
        order_id,
        rro_info,
        shop_name,
        public_key,
        description,
        action: 'pay',
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

    return ctx.send({ data, signature });
  },

  async callback(ctx) {
    if (ctx.request.method === 'POST') {
      const { data, signature, userId, products, customer } = ctx.request.body;

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

      const { order_id, status, amount } = decodedData;

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

      const existingOrder = await strapi.query('api::order.order').findOne({
        where: { paymentIntentID: order_id },
      });

      if (existingOrder) {
        return ctx.send({
          status: 200,
          order: existingOrder,
          message: 'Transaction complete',
        });
      }

      const order = await strapi.query('api::order.order').create({
        data: {
          amount,
          products,
          user: userId,
          status: orderStatus,
          self_delivery: customer.self_delivery,
          customer_firstName: customer.firstName,
          customer_lastName: customer.lastName,
          customer_email: customer.email,
          customer_phone: customer.phone,
          customer_city: customer.customer_city,
          customer_warehouse: customer.customer_warehouse,
          paymentIntentID: order_id,
          publishedAt: new Date(),
        },
      });

      return ctx.send({
        status: 200,
        order: order,
        message: 'Transaction complete',
      });
    } else {
      return ctx.send({ status: 405, message: 'Method not allowed' });
    }
  },
};
