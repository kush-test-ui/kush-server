'use strict';

/**
 * A set of functions called "actions" for `sign-in`
 */

const crypto = require('crypto');

module.exports = {
  async signIn(ctx) {
    const { identifier, password, locale, remember } = ctx.request.body;

    try {
      const user = await strapi.query("plugin::users-permissions.user").findOne({
        where: { email:identifier },
      });

      if(!user) {
        return ctx.badRequest(locale === 'uk' ? "Даний email не зареестрований." : "This email are not registered.", 400);
      }
      
      const validPassword = await strapi.plugins['users-permissions'].services.user.validatePassword(
        password,
        user.password
      );
  
      if (!validPassword) {
        return ctx.badRequest(locale === 'uk' ? "Не вірний пароль." : "Invalid password.", 400);
      }
  
      const tokenExpiry = remember === 'on' ? '14d' : '1d'; 
  
      const jwt = {
        accessToken: strapi.plugins['users-permissions'].services.jwt.issue({ 
          id: user.id, 
          firstName:user.firstName, 
          lastName:user.lastName, 
          phoneNumber:user.phoneNumber, 
          deliveryAddress:user.deliveryAddress, 
          stripeCustomerId:user.stripeCustomerId,
          blocked:user.blocked,  
          confirmed:user.confirmed,
          provider:user.provider
          }, 
          { expiresIn: tokenExpiry }),
        refreshToken: crypto.randomBytes(64).toString('hex'),
      };
      
      ctx.send({  
        jwt, 
        id:user.id,
        picture:user.avatar,
        username:user.username,
        message:locale === 'uk' ? 'З поверненям' : 'Welcome back',
        status: 200 
      }, 200)
    } catch(err) {
      ctx.badRequest(err)
    }
  },
};
