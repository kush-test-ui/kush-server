'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::delivery.delivery', {
  config: {
    find: { auth: false },
    findOne: { auth: false },
  },
});
