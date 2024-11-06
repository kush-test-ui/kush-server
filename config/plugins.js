module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
      actionOptions: {
        upload: {},
        delete: {},
      },
    },
  },
  email: {
    config: {
      provider: 'strapi-provider-email-resend',
      providerOptions: {
        apiKey: env('RESEND_API_KEY')
      },
      settings: {
        defaultFrom: env('RESEND_DOMAIN_NAME'),
        defaultReplyTo:  env('RESEND_DOMAIN_NAME'),
      },
    },
  },
  'email-designer': {
    enabled: true,
  },
});
