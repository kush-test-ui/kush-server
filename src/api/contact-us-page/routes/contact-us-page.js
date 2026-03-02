'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::contact-us-page.contact-us-page', {
  config: {
    find: { auth: false },
  },
});
