'use strict';

// this module inputs {MONO_MERCHANT_TOKEN, MONO_API_URL, MONO_WIDGET_KEY_ID, MONO_WIDGET_PRIVATE_KEY}, provides mono acquiring helpers, returns service object
const crypto = require('crypto');

const MONO_API_URL = 'https://api.monobank.ua';
const MONO_MERCHANT_TOKEN = 'moDBams5IclNNjZU94zMP0A';
const MONO_WIDGET_KEY_ID = 'CWVxG8NJWkE3E3';
const MONO_WIDGET_PRIVATE_KEY = 'LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1JR0hBZ0VBTUJNR0J5cUdTTTQ5QWdFR0NDcUdTTTQ5QXdFSEJHMHdhd0lCQVFRZzN4d09uckZkdHpNQUQrWFQKV0lLZUI3TXlWa3IreS82aEh3clFIOXVQR1Q2aFJBTkNBQVFBY1hxbGdQZjhRK2NUUjBpQzUzQnJ5ZVRaUTJqZQozak1admZVSHhwc3RUQ0hxZUdnN0UwS2NSUk5ycUlmeEZyS2t5ejQ5YkUycVUzdFdnNUxxa3VNYwotLS0tLUVORCBQUklWQVRFIEtFWS0tLS0t';

// cached pubkey to avoid extra requests on every webhook
let cachedPubKey = null;

// inputs {}, fetches mono merchant public key (PEM), returns string
const fetchPubKey = async () => {
  if (cachedPubKey) return cachedPubKey;

  const res = await fetch(`${MONO_API_URL}/api/merchant/pubkey`, {
    headers: { 'X-Token': MONO_MERCHANT_TOKEN },
  });

  if (!res.ok) {
    throw new Error(`Mono pubkey fetch failed: ${res.status}`);
  }

  const data = await res.json();
  // mono returns base64-encoded DER pubkey
  const pubKeyDer = Buffer.from(data.key, 'base64');
  cachedPubKey = `-----BEGIN PUBLIC KEY-----\n${pubKeyDer.toString('base64').match(/.{1,64}/g).join('\n')}\n-----END PUBLIC KEY-----`;
  return cachedPubKey;
};

module.exports = () => ({
  // inputs {amount(kopecks), ccy, merchantPaymInfo, redirectUrl, webHookUrl, validity, displayType}, creates mono invoice, returns {invoiceId, pageUrl}
  async createInvoice({ amount, ccy = 980, merchantPaymInfo, redirectUrl, webHookUrl, validity = 3600, displayType }) {
    if (!MONO_MERCHANT_TOKEN) throw new Error('MONO_MERCHANT_TOKEN is not configured');

    const res = await fetch(`${MONO_API_URL}/api/merchant/invoice/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Token': MONO_MERCHANT_TOKEN,
      },
      body: JSON.stringify({ amount, ccy, merchantPaymInfo, redirectUrl, webHookUrl, validity, displayType }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Mono create invoice failed: ${res.status} — ${err}`);
    }

    return res.json();
  },

  // inputs {rawBody(string), xSignBase64(string)}, verifies ECDSA-SHA256 webhook signature, returns boolean
  async verifySignature(rawBody, xSignBase64) {
    try {
      const pubKeyPem = await fetchPubKey();
      const signature = Buffer.from(xSignBase64, 'base64');
      const verify = crypto.createVerify('SHA256');
      verify.update(rawBody);
      return verify.verify(pubKeyPem, signature);
    } catch (err) {
      strapi.log.error('Mono signature verification error:', err);
      return false;
    }
  },

  // inputs {orderData(object), requestId(string)}, builds MonoPay JS widget config, returns {keyId, signature, requestId, payloadBase64}
  buildWidgetConfig(orderData, requestId) {
    if (!MONO_WIDGET_KEY_ID || !MONO_WIDGET_PRIVATE_KEY) {
      throw new Error('MONO_WIDGET_KEY_ID or MONO_WIDGET_PRIVATE_KEY is not configured');
    }

    // payloadBase64 — base64-encoded JSON of order data (structure identical to invoice/create params)
    const payloadBase64 = Buffer.from(JSON.stringify(orderData)).toString('base64');

    // dataToSign = serialized orderData concatenated with requestId (as per mono widget docs)
    const dataToSign = JSON.stringify(orderData) + requestId;

    // decode PEM private key from base64 env var
    const privateKeyPem = Buffer.from(MONO_WIDGET_PRIVATE_KEY, 'base64').toString('utf8');

    const sign = crypto.createSign('SHA256');
    sign.update(dataToSign);
    const signature = sign.sign(privateKeyPem, 'base64');

    return { keyId: MONO_WIDGET_KEY_ID, signature, requestId, payloadBase64 };
  },

  // inputs {invoiceId(string)}, fetches invoice status from mono as fallback, returns status object
  async getInvoiceStatus(invoiceId) {
    if (!MONO_MERCHANT_TOKEN) throw new Error('MONO_MERCHANT_TOKEN is not configured');

    const res = await fetch(
      `${MONO_API_URL}/api/merchant/invoice/status?invoiceId=${encodeURIComponent(invoiceId)}`,
      { headers: { 'X-Token': MONO_MERCHANT_TOKEN } }
    );

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Mono invoice status failed: ${res.status} — ${err}`);
    }

    return res.json();
  },
});
