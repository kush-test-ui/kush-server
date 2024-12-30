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
  async sendPageView(ctx) {
    const { session } = ctx.request.body;

    const pixelId = 351610264681498;
    const accessToken =
      'EAAGQHHtRco4BO3s1EEeu1cbuVfuOmSVJee4smWOf0jdm0MD9m68ZCvCvNbgTVcyIHTOstIz1inE24ec2ykVjga3bESw88BZCT6umUvoZABuXUtobg2lOrZBNkqTlp2DmSU9PXsakwshEA3NZAZCJdZB6egeujj4q9YfcONZALhKxGzF9CYsy8umZCZALdmHNY3y8MSDgZDZD';

    const hashedUserData = {
      fn: session?.firstName ? [hash(session.firstName)] : undefined,
      ln: session?.lastName ? [hash(session.lastName)] : undefined,
      ph: session?.phoneNumber ? [hash(session.phoneNumber)] : undefined,
      em: session?.email ? [hash(session.email)] : undefined,
      ct: session?.city ? [hash(session.city)] : undefined,
      country: [hash('ukraine')],
      client_ip_address: ctx.request.ip,
      client_user_agent: ctx.request.headers['user-agent'],
      external_id: `session_${Math.random().toString(36).slice(2, 9)}`,
    };

    try {
      const response = await fetch(
        `https://graph.facebook.com/v15.0/${pixelId}/events?access_token=${accessToken}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: [
              {
                event_name: 'PageView',
                event_time: Math.floor(Date.now() / 1000),
                user_data: hashedUserData,
                action_source: 'website',
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error('Error sending InitiateCheckout event:', errorResponse);
        return ctx.badRequest('Failed to send event', errorResponse);
      }

      const responseData = await response.json();

      return ctx.send({
        message: 'Event sent successfully',
        response: responseData,
      });
    } catch (error) {
      console.error('Error sending InitiateCheckout event:', error.message);
      return ctx.badRequest('Failed to send event');
    }
  },
};
