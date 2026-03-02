module.exports = [
  'strapi::logger',
  'strapi::errors',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  {
    name: 'strapi::body',
    config: {
      // includeUnparsed saves raw body at ctx.request.body[Symbol.for('unparsedBody')]
      // required for ECDSA verification of mono webhooks (signature must match exact original bytes)
      includeUnparsed: true,
    },
  },
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          upgradeInsecureRequests: null,
          'connect-src': [
            "'self'",
            'https:',
            'http:',
            'api.telegram.org',
            'api.monobank.ua',
            'pay.monobank.ua',
            // 'api.liqpay.ua', // LiqPay — commented, replaced by mono
          ],
          'frame-src': [
            "'self'",
            'editor.unlayer.com',
            'pay.monobank.ua',
            // '*.liqpay.ua', // LiqPay — commented, replaced by mono
          ],
          'script-src': [
            "'self'",
            "'unsafe-inline'",
            'editor.unlayer.com',
            'maps.googleapis.com',
            'pay.monobank.ua',
            // '*.liqpay.ua', // LiqPay — commented, replaced by mono
          ],
          'script-src-elem': [
            "'self'",
            "'unsafe-inline'",
            'editor.unlayer.com',
            'maps.googleapis.com',
            'pay.monobank.ua',
            // '*.liqpay.ua', // LiqPay — commented, replaced by mono
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'res.cloudinary.com',
            'maps.gstatic.com',
            'maps.googleapis.com'
          ],
          'img-src': [
            "'self'",
            'blob:',
            'data:',
            'strapi.io',
            'cdn.jsdelivr.net',
            's3.amazonaws.com',
            'res.cloudinary.com',
            'market-assets.strapi.io',
            'maps.gstatic.com',
            'maps.googleapis.com',
            // '*.liqpay.ua', // LiqPay — commented, replaced by mono
            'khmdb0.google.com',
            'khmdb0.googleapis.com',
            'khmdb1.google.com',
            'khmdb1.googleapis.com',
            'khm.google.com',
            'khm.googleapis.com',
            'khm0.google.com',
            'khm0.googleapis.com',
            'khm1.google.com',
            'khm1.googleapis.com',
            'khms0.google.com',
            'khms0.googleapis.com',
            'khms1.google.com',
            'khms1.googleapis.com',
            'khms2.google.com',
            'khms2.googleapis.com',
            'khms3.google.com',
            'khms3.googleapis.com',
            'streetviewpixels-pa.googleapis.com',
          ],
          'form-action': [
            "'self'",
            // '*.liqpay.ua', // LiqPay — commented, replaced by mono
          ],
        },
      },
      // frameguard liqpay — commented, replaced by mono
      // frameguard: {
      //   enable: true,
      //   policy: 'allow-from',
      //   domains: ['*.liqpay.ua']
      // },
    },
  },
];
