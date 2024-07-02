module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/sign-in',
      handler: 'auth.signIn',
    },
  ],
};
