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
  ],
};
