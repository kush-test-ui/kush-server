'use strict';

/**
 * auth-notification service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::auth-notification.auth-notification');
