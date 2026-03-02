'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::size.size', {
  config: {
    find: { auth: false },
    findOne: { auth: false },
  },
});
