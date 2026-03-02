'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::forgot-page.forgot-page', {
  config: {
    find: { auth: false },
  },
});
