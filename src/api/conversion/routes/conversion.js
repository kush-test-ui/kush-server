module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/conversion',
      handler: 'conversion.sendMetaEvent',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
