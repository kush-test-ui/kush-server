// @ts-nocheck

'use strict';


/**
 * A set of functions called "actions" for `email-subscription`
 */

module.exports = {
  async subscribe(ctx) {
    const { email, locale } = ctx.request.body;

    const messages = {
      uk: {
        emailRequired: 'Не вірний формат пошти',
        alreadySubscribed: 'Вже підписані!',
        subscribedSuccessfully: 'Дякуємо за підписку!',
      },
      default: {
        emailRequired: 'Invalid email format!',
        alreadySubscribed: 'Already subscribed!',
        subscribedSuccessfully: 'Subscribed successfully!',
      }
    };

    const localeMessages = messages[locale] || messages.default;

    if (!email) {
      return ctx.badRequest(localeMessages.emailRequired);
    }

    const existedEmail = await strapi.query('api::subscription.subscription').findOne({
      where: { email }
    });

    if (existedEmail) {
      return ctx.send({ message: localeMessages.alreadySubscribed }, 409);
    }

    const newEmail = await strapi.query('api::subscription.subscription').create({
      data: { email }
    });

    return ctx.send({ message: localeMessages.subscribedSuccessfully, data: newEmail }, 201);
  }
};