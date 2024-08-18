module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/contact-us',
      handler: 'contact-us.contactUs',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
