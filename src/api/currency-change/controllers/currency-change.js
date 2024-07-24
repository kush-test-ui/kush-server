'use strict';

/**
 * A set of functions called "actions" for `currency-change`
 */

module.exports = {
  async getRates(ctx) {
    try {
      const response = await fetch('https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=11');
      const rates = await response.json();
      ctx.send(rates);
    } catch (err) {
      ctx.throw(500, 'Failed to fetch currency data');
    }
  },
};