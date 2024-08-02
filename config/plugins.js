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
        apiKey: "re_4JrtYSot_8PbZoLo2EUCsZA9uJErKkKH6",
      },
      settings: {
        defaultFrom: 'noreply@kush.com',
        defaultReplyTo: 'noreply@kush.com',
      },
    }
  },
  'email-designer': {
    enabled: true,
  }, 
});