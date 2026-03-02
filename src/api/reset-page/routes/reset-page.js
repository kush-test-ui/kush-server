'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::reset-page.reset-page', {
  config: {
    find: { auth: false },
  },
});
