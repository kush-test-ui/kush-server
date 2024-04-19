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
        apiKey: env('SMTP_PASSWORD'),
      },
      settings: {
        defaultFrom: 'onboarding@resend.dev',
        defaultReplyTo: 'onboarding@resend.dev',
      },
    }
  },
  'email-designer': {
    enabled: true,
  }, 
});