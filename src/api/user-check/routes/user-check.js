module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/check',
      handler: 'user-existence.check',
    },
  ],
};