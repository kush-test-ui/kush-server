'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::success-page.success-page', {
  config: {
    find: { auth: false },
  },
});
