module.exports = {
  routes: [
    {
      method: 'PUT',
      path: '/order-update',
      handler: 'order-update.updateOrder',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
