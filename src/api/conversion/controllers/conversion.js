'use strict';

/**
 * A set of functions called "actions" for `conversion`
 */

const crypto = require('crypto');

const hash = (data) => {
  if (!data) return null;
  return crypto
    .createHash('sha256')
    .update(data.trim().toLowerCase())
    .digest('hex');
};

// Standard TikTok Events
const TIKTOK_EVENTS = {
  VIEW_CONTENT: "ViewContent",
  SEARCH: "Search",
  ADD_TO_CART: "AddToCart",
  ADD_TO_WISHLIST: "AddToWishlist",
  INITIATE_CHECKOUT: "InitiateCheckout",
  PURCHASE: "Purchase",
  SUBSCRIBE: "Subscribe",
  CONTACT: "Contact",
  COMPLETE_REGISTRATION: "CompleteRegistration",
  SUBMIT_FORM: "SubmitForm",
};

module.exports = {
  async sendMetaEvent(ctx) {
    const { event_name, event_time, user_data, custom_data, action_source } =
      ctx.request.body;

    const pixelId = process.env.FACEBOOK_PIXEL_ID || '351610264681498';
    const accessToken =
      process.env.FACEBOOK_ACCESS_TOKEN ||
      'EAAGQHHtRco4BO3s1EEeu1cbuVfuOmSVJee4smWOf0jdm0MD9m68ZCvCvNbgTVcyIHTOstIz1inE24ec2ykVjga3bESw88BZCT6umUvoZABuXUtobg2lOrZBNkqTlp2DmSU9PXsakwshEA3NZAZCJdZB6egeujj4q9YfcONZALhKxGzF9CYsy8umZCZALdmHNY3y8MSDgZDZD';

    // Hash sensitive user data
    const hashedUserData = {
      em: user_data?.email ? [hash(user_data.email)] : null,
      ph: user_data?.phoneNumber ? [hash(user_data.phoneNumber)] : null,
      fn: user_data?.firstName ? [hash(user_data.firstName)] : null,
      ln: user_data?.lastName ? [hash(user_data.lastName)] : null,
      country: user_data?.country ? [hash('ua')] : null,
      fbp: user_data?.fbp,
      external_id: user_data?.id,
      client_user_agent: ctx.request.headers['user-agent'] || null,
      client_ip_address: ctx.request.ip || '0.0.0.0',
    };

    const payload = {
      event_name,
      event_time,
      custom_data,
      action_source,
      user_data: hashedUserData,
    };

    try {
      const response = await fetch(
        `https://graph.facebook.com/v15.0/${pixelId}/events?access_token=${accessToken}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data: [payload] }),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error(`Error sending ${event_name} event:`, errorResponse);
        return ctx.badRequest('Failed to send event', errorResponse);
      }

      const responseData = await response.json();

      return ctx.send({
        message: `${event_name} event sent successfully`,
        response: responseData,
      });
    } catch (error) {
      console.error(`Error sending ${event_name} event:`, error.message);
      return ctx.badRequest('Failed to send event');
    }
  },
  
  async sendTikTokEvent(ctx) {
    const { event_name, event_time, user_data, custom_data, event_source } =
      ctx.request.body;
      
    // Validate event name
    if (!Object.values(TIKTOK_EVENTS).includes(event_name)) {
      return ctx.badRequest('Invalid event name. Must be one of the standard TikTok events.');
    }

    const pixelId = process.env.TIKTOK_PIXEL_ID || 'D07OAKBC77UFFMMCNQE0';
    const accessToken =
      process.env.TIKTOK_ACCESS_TOKEN ||
      '2d08f3d32d31eb0a256c6d2e197b6b982f61e60d';

    // Hash sensitive user data
    const hashedUserData = {
      email: user_data?.email ? hash(user_data.email) : null,
      phone_number: user_data?.phoneNumber ? hash(user_data.phoneNumber) : null,
      external_id: user_data?.id ? hash(user_data.id) : null,
      ip: ctx.request.ip || '0.0.0.0',
      user_agent: ctx.request.headers['user-agent'] || null,
    };

    // Filter out null values
    Object.keys(hashedUserData).forEach(key => 
      hashedUserData[key] === null && delete hashedUserData[key]
    );

    const timestamp = event_time || Math.floor(Date.now() / 1000);
    
    const payload = {
      pixel_code: pixelId,
      event: event_name,
      timestamp: timestamp,
      context: {
        user: hashedUserData,
        page: {
          url: ctx.request.body.page_url || ctx.request.headers.referer || null,
        }
      },
      properties: custom_data,
      source: event_source || "web"
    };

    try {
      const response = await fetch(
        `https://business-api.tiktok.com/open_api/v1.3/pixel/track/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Access-Token': accessToken
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error(`Error sending TikTok ${event_name} event:`, errorResponse);
        return ctx.badRequest('Failed to send TikTok event', errorResponse);
      }

      const responseData = await response.json();

      return ctx.send({
        message: `TikTok ${event_name} event sent successfully`,
        response: responseData,
      });
    } catch (error) {
      console.error(`Error sending TikTok ${event_name} event:`, error.message);
      return ctx.badRequest('Failed to send TikTok event');
    }
  },
};
