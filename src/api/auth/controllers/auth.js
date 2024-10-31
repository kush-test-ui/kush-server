'use strict';

/**
 * A set of functions called "actions" for `sign-in`
 */

const crypto = require('crypto');

module.exports = {
  async signIn(ctx) {
    const { identifier, password, locale, remember } = ctx.request.body;

    try {
      const user = await strapi
        .query('plugin::users-permissions.user')
        .findOne({
          where: { email: identifier },
        });

      if (!user) {
        return ctx.badRequest(
          locale === 'uk'
            ? 'Даний email не зареестрований.'
            : 'This email are not registered.',
          400
        );
      }

      const validPassword = await strapi.plugins[
        'users-permissions'
      ].services.user.validatePassword(password, user.password);

      if (!validPassword) {
        return ctx.badRequest(
          locale === 'uk' ? 'Не вірний пароль.' : 'Invalid password.',
          400
        );
      }

      const tokenExpiry = remember === 'on' ? '7d' : '1d';

      const jwt = {
        accessToken: strapi.plugins['users-permissions'].services.jwt.issue(
          {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            deliveryAddress: user.deliveryAddress,
            stripeCustomerId: user.stripeCustomerId,
            blocked: user.blocked,
            confirmed: user.confirmed,
            provider: user.provider,
            email: user.email,
            date: user.date,
            city: user.city,
            warehouse: user.warehouse,
            cityID: user.cityID,
            warehouseID: user.warehouseID,
          },
          { expiresIn: tokenExpiry }
        ),
        refreshToken: crypto.randomBytes(64).toString('hex'),
      };

      ctx.send(
        {
          jwt,
          id: user.id,
          username: user.username,
          message: locale === 'uk' ? 'З поверненям' : 'Welcome back',
          status: 200,
        },
        200
      );
    } catch (err) {
      ctx.badRequest(err);
    }
  },

  async isUserExist(ctx) {
    const { email } = ctx.request.body;
    try {
      const user = await strapi
        .query('plugin::users-permissions.user')
        .findOne({
          where: { email },
        });

      if (user) {
        const jwt = {
          accessToken: strapi.plugins['users-permissions'].services.jwt.issue(
            {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              phoneNumber: user.phoneNumber,
              deliveryAddress: user.deliveryAddress,
              stripeCustomerId: user.stripeCustomerId,
              blocked: user.blocked,
              confirmed: user.confirmed,
              provider: user.provider,
              email: user.email,
              date: user.date,
              city: user.city,
              warehouse: user.warehouse,
              cityID: user.cityID,
              warehouseID: user.warehouseID,
            },
            { expiresIn: '7d' }
          ),
        };

        ctx.send(
          {
            jwt,
            id: user.id,
            username: user.username,
            exist: true,
            status: 200,
          },
          200
        );
      } else {
        ctx.send(
          { message: 'User does not exist', exist: false, status: 200 },
          200
        );
      }
    } catch (err) {
      ctx.badRequest('Error checking user existence', { details: err });
    }
  },
};
