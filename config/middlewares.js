module.exports = [
  'strapi::logger',
  'strapi::errors',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        directives: {
          upgradeInsecureRequests: null,
          'connect-src': ["'self'", 'https:', 'http:'],
          'script-src': ["'self'", 'editor.unlayer.com'],
          'script-src-elem': ["'self'", 'editor.unlayer.com'],
          'frame-src': ["'self'", 'editor.unlayer.com'],
          'media-src': ["'self'", 'data:', 'blob:', 'res.cloudinary.com'],
          'img-src': [
            "'self'",
            'data:',
            'strapi.io',
            'cdn.jsdelivr.net',
            's3.amazonaws.com',
            'res.cloudinary.com',
            'market-assets.strapi.io',
          ],
        },
      },
    },
  },
];
