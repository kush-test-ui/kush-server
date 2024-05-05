"use strict"

module.exports = {
  getProducts: async (ctx) => {
    const { page = 1, pageSize = 5, sort = 'id:ASC', id, name = '', locale = 'uk' } = ctx.query;

    try {
      const productPage = await strapi.entityService.findOne(
        "api::products-page.products-page",
        id,
        { 
        populate: { 
          products: {
            locale,
            populate: {
              cover: { fields: ['url', 'alternativeText'] },
              images: { fields: ['url', 'alternativeText'] },
            },
            filters: {
              title: {
                $contains: name,
              }
            },
          } 
        }, 
        locale,
        sort
      });

      if (!productPage) {
        return ctx.notFound("Product page  not found");
      }

      const paginatedProducts = productPage.products.slice((page - 1) * pageSize, page * pageSize);
      const totalPages = Math.ceil(productPage.products.length / pageSize);

      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;
      
      ctx.send({
        products: paginatedProducts,
        total: productPage.products.length,
        page,
        pageSize,
        hasNextPage,
        hasPreviousPage,
        message:!paginatedProducts.length && name !== '' ? 'Not found' : null
      });
    } catch (error) {
      ctx.badRequest(error.message || "An error occurred");
    }
  },
};
