'use strict';

/**
 * A set of functions called "actions" for `user-check`
 */

module.exports = {
  /**
   * Checks if a user with the provided email exists.
   *
   * @param {object} ctx - Koa context
   */
  async check(ctx) {
    const { email } = ctx.request.body;

    // Use Strapi query service for efficient user search
    try {
      const existingUser = await strapi.services.user.findOne({ email });

      if (existingUser) {
        ctx.send({ message: 'User already exists' }, 409);
      } else {
        ctx.send({ message: 'User does not exist' }, 200);
      }
    } catch (err) {
      ctx.badRequest('Error checking user existence', { details: err });
    }
  },
};