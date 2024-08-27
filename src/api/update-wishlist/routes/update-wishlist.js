module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/update-wishlist',
      handler: 'update-wishlist.updateWishlist',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
