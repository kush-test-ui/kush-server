'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::offerta-page.offerta-page', {
  config: {
    find: { auth: false },
  },
});
