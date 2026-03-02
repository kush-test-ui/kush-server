'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::about-us-page.about-us-page', {
  config: {
    find: { auth: false },
  },
});
