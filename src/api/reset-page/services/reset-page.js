'use strict';

/**
 * reset-page service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::reset-page.reset-page');
