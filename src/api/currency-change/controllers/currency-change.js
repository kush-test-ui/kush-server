'use strict';

// this module inputs ctx (Strapi/Koa), fetches rates from Monobank /bank/currency, returns [{ccy, base_ccy, buy, sale}]
module.exports = {
  async getRates(ctx) {
    try {
      const response = await fetch('https://api.monobank.ua/bank/currency');
      const rates = await response.json();

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

      ctx.send(transformed);
    } catch (err) {
      ctx.throw(500, 'Failed to fetch currency data');
    }
  },
};