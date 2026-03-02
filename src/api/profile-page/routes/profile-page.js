'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::profile-page.profile-page', {
  config: {
    find: { auth: false },
  },
});
