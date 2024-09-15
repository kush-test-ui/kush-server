module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/payment/create',
      handler: 'payment.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/payment/callback',
      handler: 'payment.callback',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
