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
        apiKey: "re_PJQPr37h_AGk3XNdS82RFAv6DeEjgB5Fs",
      },
      settings: {
        defaultFrom: 'no-reply@kush-ecommerce.online',
        defaultReplyTo: 'no-reply@kush-ecommerce.online',
      },
    }
  },
  'email-designer': {
    enabled: true,
  }, 
});