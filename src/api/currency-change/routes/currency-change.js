module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/currency-change',
      handler: 'currency-change.getRates',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
