module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/user-check',
      handler: 'user-check.findUser',
    },
  ],
};