'use strict';

// ─── LiqPay (commented — replaced by mono) ────────────────────────────────────
// const crypto = require('crypto');
//
// const generatePayload = ({ order_id, status, customer, amount, updatedProducts }) => {
//   return `
// <b>Замовлення №:</b> ${order_id}
// <b>Cтатус: </b> ${status}
// <b>Покупець:</b> ${customer.firstName} ${customer.lastName}
// <b>Номер телефону:</b> +${customer.phone}
// <b>Пошта:</b> ${customer.email}
// <b>Товар:</b>${updatedProducts.map(({ name, size, material }) =>
//   `${name}\n${size ? `<b>Розмір:</b> ${size}\n` : ''}${material ? `<b>Матеріал:</b> ${material}` : ''}`).join('')}
// <b>Cума оплати:</b> ${amount} грн.
// <b>Доставка:</b> ${
//   customer.self_delivery
//     ? 'Самовивіз'
//     : `\n<b>Місто:</b> ${customer.customer_city}\n<b>Відділення:</b> ${customer.customer_warehouse}`
//   }`;
// };
//
// module.exports = {
//   async create(ctx) {
//     const public_key = 'i85549703498';
//     const private_key = 'n6JKQIKKGswTTgKhRcsaP9L0O6L8J5fXAL6FT6sZ';
//     ... (LiqPay data/signature creation) ...
//     return ctx.send({ data, signature });
//   },
//   async callback(ctx) {
//     const private_key = 'n6JKQIKKGswTTgKhRcsaP9L0O6L8J5fXAL6FT6sZ';
//     ... (LiqPay sha1 signature verify, order create/update) ...
//   },
// };
// ─────────────────────────────────────────────────────────────────────────────

// this module inputs ctx (Strapi/Koa), handles mono payment create (iframe invoice) and webhook callback, returns HTTP responses
const crypto = require('crypto');

const PAYMENT_RESULT_URL_UK = 'https://www.kush.jewelry/uk/?checkout=success';
const PAYMENT_RESULT_URL_EN = 'https://www.kush.jewelry/en/?checkout=success';
const PAYMENT_WEBHOOK_URL = 'https://api.kush.jewelry/api/payment/callback';

// mono status -> internal status mapping
const MONO_STATUS_MAP = {
  success: 'success',
  processing: 'wait_secure',
  hold: 'wait_secure',
  failure: 'failure',
  expired: 'failure',
  reversed: 'failure',
  created: 'created',
};

// inputs {order_id, status, customer, amount, updatedProducts}, sends Telegram message
const postTelegramNotification = async ({ order_id, status, customer, amount, updatedProducts }) => {
  const text = `
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

  await fetch(`https://api.telegram.org/bot${process.env.TG_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: `${process.env.TG_CHAT_ORDER_ID}`,
      parse_mode: 'HTML',
      text,
    }),
  });
};

module.exports = {
  // inputs ctx with {amount, currency, order_id, description, products, customer, language},
  // creates mono invoice with displayType=iframe and pending order, returns {checkoutUrl, invoiceId, orderId}
  async create(ctx) {
    const {
      amount,
      order_id,
      products,
      customer,
      language,
    } = ctx.request.body;

    const normalizedAmount = Number(amount);
    if (!order_id || !Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
      return ctx.send({ status: 400, message: 'Invalid required fields: amount, order_id' });
    }

    const monoService = strapi.service('api::payment.payment');

    // mono expects amount in kopecks (minimum units)
    const amountKopecks = Math.round(normalizedAmount * 100);

    const basketOrder = Array.isArray(products)
      ? products.map((p) => ({
          name: p.name || 'Товар',
          qty: p.quantity || 1,
          sum: Math.round(parseFloat(p.price || 0) * 100),
          total: Math.round(parseFloat(p.price || 0) * 100 * (p.quantity || 1)),
          unit: 'шт.',
          code: String(p.id || ''),
          icon: p.icon || undefined,
        }))
      : [];

    const currentLanguage = language === 'en' ? 'en' : 'uk';
    const redirectUrl = currentLanguage === 'en' ? PAYMENT_RESULT_URL_EN : PAYMENT_RESULT_URL_UK;

    const productNames = Array.isArray(products)
      ? products
        .map((p) => p?.name)
        .filter(Boolean)
        .join(', ')
      : '';
    const paymentLabel = currentLanguage === 'en'
      ? `Payment for product${productNames ? `: ${productNames}` : ''}`
      : `Оплата за товар${productNames ? `: ${productNames}` : ''}`;

    const widgetOrderData = {
      amount: amountKopecks,
      ccy: 980,
      merchantPaymInfo: {
        reference: order_id,
        destination: paymentLabel,
        comment: paymentLabel,
        basketOrder,
      },
      redirectUrl,
      webHookUrl: PAYMENT_WEBHOOK_URL,
      validity: 3600,
    };

    let invoiceData;
    try {
      invoiceData = await monoService.createInvoice({
        ...widgetOrderData,
        displayType: 'iframe',
      });
    } catch (err) {
      strapi.log.error('Mono createInvoice iframe error:', err);
      return ctx.send({ status: 500, message: 'Failed to create mono iframe invoice' });
    }

    const { invoiceId, pageUrl } = invoiceData;

    // create order before payment with invoiceId for direct webhook matching
    let order;
    try {
      order = await strapi.query('api::order.order').create({
        data: {
          status: 'created',
          paymentIntentID: invoiceId,
          amount: amountKopecks,
          products: Array.isArray(products) ? products : [],
          customer_firstName: customer?.firstName || '',
          customer_lastName: customer?.lastName || '',
          customer_email: customer?.email || '',
          customer_phone: customer?.phone || '',
          customer_city: customer?.customer_city || '',
          customer_warehouse: customer?.customer_warehouse || '',
          self_delivery: customer?.self_delivery || false,
          publishedAt: new Date(),
        },
      });
    } catch (err) {
      strapi.log.error('Mono order create error:', err);
      return ctx.send({ status: 500, message: 'Failed to create order' });
    }

    let monoWidgetConfig = null;
    try {
      // optional widget config for extra payment method under iframe
      monoWidgetConfig = monoService.buildWidgetConfig(widgetOrderData, crypto.randomUUID());
    } catch (err) {
      strapi.log.warn('Mono buildWidgetConfig skipped:', err?.message || err);
    }

    return ctx.send({
      checkoutUrl: pageUrl,
      invoiceId,
      orderId: order.id,
      reference: order_id,
      monoWidgetConfig,
    });
  },

  // inputs ctx with mono webhook body + X-Sign header,
  // verifies ECDSA signature, updates order status, returns 200 OK
  async callback(ctx) {
    if (ctx.request.method !== 'POST') {
      return ctx.send({ status: 405, message: 'Method not allowed' });
    }

    // unparsedBody contains the original raw bytes as received — required for ECDSA verification
    // strapi::body middleware is configured with includeUnparsed: true
    const rawBody = ctx.request.body[Symbol.for('unparsedBody')] || JSON.stringify(ctx.request.body);
    const xSign = ctx.request.headers['x-sign'];

    if (!xSign) {
      strapi.log.warn('Mono webhook: missing X-Sign header');
      return ctx.send({ status: 400, message: 'Missing X-Sign header' });
    }

    const monoService = strapi.service('api::payment.payment');

    const isValid = await monoService.verifySignature(rawBody, xSign);
    if (!isValid) {
      strapi.log.warn('Mono webhook: invalid signature');
      return ctx.send({ status: 401, message: 'Invalid signature' });
    }

    const payload = ctx.request.body;

    const { invoiceId, status: monoStatus, modifiedDate, amount } = payload;
    // reference from merchantPaymInfo is used as fallback for mixed flows
    const reference = payload?.merchantPaymInfo?.reference || payload?.reference;

    if (!invoiceId) {
      return ctx.send({ status: 400, message: 'Missing invoiceId' });
    }

    const internalStatus = MONO_STATUS_MAP[monoStatus] || 'failure';

    // find order: first by reference (widget flow), then by invoiceId (legacy/redirect flow)
    const existingOrder = reference
      ? await strapi.query('api::order.order').findOne({ where: { paymentIntentID: reference } })
        || await strapi.query('api::order.order').findOne({ where: { paymentIntentID: invoiceId } })
      : await strapi.query('api::order.order').findOne({ where: { paymentIntentID: invoiceId } });

    if (!existingOrder) {
      strapi.log.warn(`Mono webhook: order not found for invoiceId=${invoiceId}`);
      // return 200 so mono does not retry endlessly
      return ctx.send({ status: 200, message: 'Order not found, ignored' });
    }

    // idempotency: only update if webhook is newer than last stored event
    const storedDate = existingOrder.mono_modified_date ? Number(existingOrder.mono_modified_date) : 0;
    const incomingDate = modifiedDate ? modifiedDate * 1000 : Date.now();

    if (incomingDate <= storedDate) {
      return ctx.send({ status: 200, message: 'Stale event, ignored' });
    }

    const updatedProducts = (existingOrder.products || []).map((p) => ({ ...p, status: internalStatus }));

    try {
      await strapi.query('api::order.order').update({
        where: { id: existingOrder.id },
        data: {
          status: internalStatus,
          products: updatedProducts,
          mono_modified_date: incomingDate,
        },
      });
    } catch (err) {
      strapi.log.error('Mono order update error:', err);
      return ctx.send({ status: 500, message: 'Order update failed' });
    }

    if (internalStatus === 'success') {
      const customer = {
        firstName: existingOrder.customer_firstName,
        lastName: existingOrder.customer_lastName,
        email: existingOrder.customer_email,
        phone: existingOrder.customer_phone,
        customer_city: existingOrder.customer_city,
        customer_warehouse: existingOrder.customer_warehouse,
        self_delivery: existingOrder.self_delivery,
      };
      const amountUah = (amount || existingOrder.amount) / 100;
      await postTelegramNotification({
        order_id: invoiceId,
        status: internalStatus,
        customer,
        amount: amountUah,
        updatedProducts,
      });
    }

    return ctx.send({ status: 200, message: 'OK' });
  },
};
