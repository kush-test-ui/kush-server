module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/conversion-meta-event',
      handler: 'conversion.sendMetaEvent',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/conversion-tiktok-event',
      handler: 'conversion.sendTikTokEvent',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
