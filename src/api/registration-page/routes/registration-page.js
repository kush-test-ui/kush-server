'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::registration-page.registration-page', {
  config: {
    find: { auth: false },
  },
});
