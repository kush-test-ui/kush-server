'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::term-page.term-page', {
  config: {
    find: { auth: false },
  },
});
