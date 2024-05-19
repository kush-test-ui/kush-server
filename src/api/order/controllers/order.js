// @ts-nocheck

'use strict';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * order controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order', ({ strapi }) => ({
  async create(ctx) {
    const { totalPrice, items, userId, paymentIntentId } = ctx.request.body;

    try {
      const user = await strapi.entityService.findOne("plugin::users-permissions.user", userId);

      const paymentIntent = paymentIntentId
      ? await stripe.paymentIntents.retrieve(paymentIntentId)
      : await stripe.paymentIntents.create({
          currency: 'usd',
          amount: totalPrice,
          automatic_payment_methods: { enabled: true },
        });
      
      const orderData = {
        user,
        amount: totalPrice,
        currency: 'usd',
        status: 'pending',
        paymentIntentID: paymentIntent.id,
        products: {
          data: items.map((item) => ({
            name: item.name,
            description: item.description || null,
            unit_amount: item.unit_amount,
            image: item.image,
            quantity: item.quantity,
          })),
        },
      };

      await strapi.service('api::order.order').create({ data: orderData });

      ctx.send({
        message: 'Payment intent created successfully',
        data: paymentIntent
      });
    } catch (err) {
      ctx.throw(400, 'Error creating payment intent');
    }
  }
}));
