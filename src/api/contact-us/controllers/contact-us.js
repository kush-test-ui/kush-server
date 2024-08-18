'use strict';

module.exports = {
  contactUs: async (ctx) => {
    const { email, name, message, locale } = ctx.request.body;
    try {
      ctx.send({
        message:
          locale === 'uk'
            ? 'Ваше повідомлення було надіслано.'
            : 'Your message was send.',
      });
    } catch (err) {
      ctx.body = err;
    }
  },
};
