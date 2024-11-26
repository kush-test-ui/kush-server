'use strict';

module.exports = {
  contactUs: async (ctx) => {
    const { email, name, message, phone, locale } = ctx.request.body;

    const payload = `<b>Ім'я:</b> ${name}\n<b>Номер телефону:</b> ${phone}\n<b>Пошта:</b> ${email}\n<b>Повідомлення:</b> ${message}`;

    const response = await fetch(
      `https://api.telegram.org/bot${process.env.TG_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: `${process.env.TG_CHAT_ID}`,
          parse_mode: 'HTML',
          text: payload,
        }),
      }
    );

    const result = await response.json();

    if (result.ok) {
      ctx.send({
        message:
          locale === 'uk'
            ? 'Ваше повідомлення було надіслано.'
            : 'Your message was send.',
      });
    } else {
      ctx.send({
        status: result?.error_code || 403,
        message: result?.message || 'System error',
      });
    }
  },
};
