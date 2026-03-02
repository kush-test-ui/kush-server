'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::material.material', {
  config: {
    find: { auth: false },
    findOne: { auth: false },
  },
});
