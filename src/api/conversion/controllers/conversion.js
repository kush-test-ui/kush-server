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
};
