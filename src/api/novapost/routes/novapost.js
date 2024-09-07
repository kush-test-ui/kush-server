module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/novapost/cities',
      handler: 'novapost.getCities',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/novapost/warehouses/:cityRef',
      handler: 'novapost.getWarehouses',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
