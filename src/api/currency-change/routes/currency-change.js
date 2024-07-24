module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/currency-change',
      handler: 'currency-change.getRates',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
