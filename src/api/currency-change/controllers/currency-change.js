'use strict';

// this module inputs ctx (Strapi/Koa), fetches rates from Monobank /bank/currency, returns [{ccy, base_ccy, buy, sale}]

// In-memory cache — Monobank rate-limits /bank/currency to once per 5 minutes
let cachedRates = null;
let cacheExpiry = 0;
const CACHE_TTL_MS = 5 * 60 * 1000;

module.exports = {
  async getRates(ctx) {
    try {
      const now = Date.now();

      // Return cached result if still valid
      if (cachedRates && now < cacheExpiry) {
        return ctx.send(cachedRates);
      }

      const response = await fetch('https://api.monobank.ua/bank/currency');

      if (!response.ok) {
        throw new Error(`Monobank currency API error: ${response.status}`);
      }

      const rates = await response.json();

      if (!Array.isArray(rates)) {
        throw new Error(`Unexpected Monobank response format: ${JSON.stringify(rates)}`);
      }

      // Map ISO 4217 numeric codes to currency string symbols
      const ISO_TO_CCY = { 840: 'USD', 978: 'EUR', 980: 'UAH', 826: 'GBP', 985: 'PLN' };
      // Only include pairs where the base currency is UAH (980)
      const ISO_TO_BASE = { 980: 'UAH' };

      // Transform to the same {ccy, base_ccy, buy, sale} shape used previously (PrivatBank format)
      // so all downstream consumers (frontend getCurrency, IExchangeRate type) remain unchanged
      const transformed = rates
        .filter(r => ISO_TO_CCY[r.currencyCodeA] && ISO_TO_BASE[r.currencyCodeB])
        .map(r => ({
          ccy: ISO_TO_CCY[r.currencyCodeA],
          base_ccy: ISO_TO_BASE[r.currencyCodeB],
          buy: String(r.rateBuy ?? r.rateCross ?? 0),
          sale: String(r.rateSell ?? r.rateCross ?? 0),
        }));

      cachedRates = transformed;
      cacheExpiry = now + CACHE_TTL_MS;

      ctx.send(transformed);
    } catch (err) {
      strapi.log.error('currency-change getRates error:', err?.message || err);
      ctx.throw(500, 'Failed to fetch currency data');
    }
  },
};