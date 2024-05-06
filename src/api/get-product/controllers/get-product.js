'use strict';

/**
 * A set of functions called "actions" for `get-product-by-id`
 */

module.exports = {
  async getProductDetails(ctx) {
    const { code, locale } = ctx.query; 

    try {
      const product = await strapi.entityService.findMany('api::product.product', {
        locale,
        filters: { code },
        populate: ['cover', 'images'] 
      });


      if (!product.length) {
        return ctx.notFound('Product not found');
      }

      ctx.send({
        product: product[0],
        cta: locale === 'uk' ? 'Додати в кошик' : 'Add to cart',
        seo: {
          metaTitle:product[0].title,
          metaDescription:null,
        }
      });
    } catch (err) {
      ctx.badRequest('Error fetching product details');
    }
  }
};
