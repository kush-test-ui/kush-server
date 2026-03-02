'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::policy-page.policy-page', {
  config: {
    find: { auth: false },
  },
});
