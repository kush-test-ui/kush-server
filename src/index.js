'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},
  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    const requiredContentTypes = [
      'api::home.home',
      'api::global.global',
      'api::about-us-page.about-us-page',
      'api::products-page.products-page',
    ];

    const loadedApiContentTypes = Object.keys(strapi.contentTypes || {}).filter((uid) =>
      uid.startsWith('api::')
    );

    const missingRequired = requiredContentTypes.filter((uid) => !loadedApiContentTypes.includes(uid));

    strapi.log.info(`[diag] Loaded API content-types count: ${loadedApiContentTypes.length}`);
    strapi.log.info(`[diag] Required API content-types present: ${missingRequired.length === 0}`);

    if (missingRequired.length > 0) {
      strapi.log.warn(`[diag] Missing required content-types: ${missingRequired.join(', ')}`);
    }
  },
};
