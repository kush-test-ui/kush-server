'use strict';

/**
 * A set of functions called "actions" for `payment`
 */

const crypto = require('crypto');

module.exports = {
  async create(ctx) {
    const { amount, currency, description, order_id } = ctx.request.body;

    const public_key = process.env.LIQPAY_PUBLIC_KEY || 'sandbox_i2714471428';
    const private_key =
      process.env.LIQPAY_PRIVATE_KEY ||
      'sandbox_YKxKymXMrPDRj8m1pG9wkWdV8tY9YEnAHdg0K9Nk';

    const version = '3';

    const data = Buffer.from(
      JSON.stringify({
        version,
        public_key,
        action: 'pay',
        amount,
        currency,
        description,
        order_id,
        sandbox: '1', // видаліть цей параметр для реальних оплат
      })
    ).toString('base64');

    const signature = crypto
      .createHash('sha1')
      .update(private_key + data + private_key)
      .digest('base64');

    return ctx.send({ data, signature });
  },
};
