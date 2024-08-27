'use strict';

/**
 * A set of functions called "actions" for `update-wishlist`
 */

module.exports = {
  updateWishlist: async (ctx) => {
    const { productId, locale = 'uk' } = ctx.request.body;
    const { id: userId } = ctx.state.user;

    try {
      if (!userId || !productId) {
        return ctx.badRequest('User ID or Product ID is missing');
      }

      // Find all localized versions of the product
      const product = await strapi.entityService.findOne(
        'api::product.product',
        productId,
        {
          populate: {
            localizations: true,
          },
        }
      );

      if (!product) {
        return ctx.notFound('Product not found');
      }

      // Extract the IDs of all localized versions of the product
      const localizedProductIds = product.localizations.map(
        (localized) => localized.id
      );
      localizedProductIds.push(productId); // Include the original product ID

      // Find the existing wishlist for the user
      const existingWishlist = await strapi.entityService.findMany(
        'api::wishlist.wishlist',
        {
          filters: { user: userId },
          populate: ['products'],
        }
      );

      let wishlist;
      let message;
      let inWishlist;

      if (existingWishlist.length > 0) {
        wishlist = existingWishlist[0];

        const productsInWishlist = wishlist.products.filter((product) =>
          localizedProductIds.includes(product.id)
        );

        if (productsInWishlist.length > 0) {
          // If the localized versions of the product are in the wishlist, remove them
          wishlist = await strapi.entityService.update(
            'api::wishlist.wishlist',
            wishlist.id,
            {
              data: {
                products: {
                  disconnect: localizedProductIds.map((id) => ({ id })), // Disconnect all localized versions
                },
                publishedAt: wishlist.publishedAt || new Date(),
              },
            }
          );
          message =
            locale === 'uk'
              ? 'Видалено зі списку бажань'
              : 'Removed from wishlist';
          inWishlist = false; // The products have been removed
        } else {
          // If the localized versions of the product are not in the wishlist, add them
          wishlist = await strapi.entityService.update(
            'api::wishlist.wishlist',
            wishlist.id,
            {
              data: {
                products: {
                  // @ts-ignore
                  connect: localizedProductIds.map((id) => ({ id })), // Connect all localized versions
                },
                publishedAt: wishlist.publishedAt || new Date(),
              },
            }
          );
          message =
            locale === 'uk' ? 'Додано до списку бажань' : 'Added to wishlist';
          inWishlist = true; // The products have been added
        }
      } else {
        // If the wishlist does not exist, create a new one and set it to published
        wishlist = await strapi.entityService.create('api::wishlist.wishlist', {
          data: {
            user: userId,
            products: {
              // @ts-ignore
              connect: localizedProductIds.map((id) => ({ id })), // Connect all localized versions
            },
            publishedAt: new Date(),
          },
        });
        message =
          locale === 'uk' ? 'Додано до списку бажань' : 'Added to wishlist';
        inWishlist = true; // The products have been added
      }

      ctx.body = {
        wishlist,
        message,
        inWishlist, // Add the inWishlist status to the response
      };
    } catch (err) {
      ctx.body = err;
      ctx.status = 500;
    }
  },
};
