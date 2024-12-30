module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/conversion',
      handler: 'conversion.sendPageView',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
