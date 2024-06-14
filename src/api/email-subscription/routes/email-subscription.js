module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/email-subscription',
      handler: 'email-subscription.subscribe',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
