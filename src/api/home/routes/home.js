'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::home.home', {
  config: {
    find: {
      auth: false,
    },
  },
});
