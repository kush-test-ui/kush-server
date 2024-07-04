module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/sign-in',
      handler: 'auth.signIn',
    },
    {
      method: 'POST',
      path: '/find-user',
      handler: 'auth.isUserExist',
    },
  ],
};
