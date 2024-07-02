'use strict';

/**
 * A set of functions called "actions" for `user-check`
 */

module.exports = {
  async findUser(ctx) {
    const { email } = ctx.request.body;
  
    try {
      const existingUser = await strapi.entityService.findMany(
        "plugin::users-permissions.user", { filters: { email }}
      );
  
      if (existingUser.length > 0) {
        const user = existingUser[0];
  
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
            { expiresIn: '14d' }),
        };

        ctx.send({  
          jwt, 
          id:user.id,
          username:user.username,
          isExist:true,
          status: 200 
        }, 200)
      } else {
        ctx.send({ message: 'User does not exist', isExist: false, status: 200 }, 200);
      }
    } catch (err) {
      ctx.badRequest('Error checking user existence', { details: err });
    }
  }
};