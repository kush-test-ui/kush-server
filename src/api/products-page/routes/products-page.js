'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::products-page.products-page', {
  config: {
    find: { auth: false },
  },
});
