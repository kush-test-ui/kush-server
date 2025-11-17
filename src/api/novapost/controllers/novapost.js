'use strict';

module.exports = {
  async getCities(ctx) {
    try {
      const apiKey =
        process.env.NOVA_POSHTA_API_KEY || 'e27e9e15de8916a6eadcfc7bc6559f58';

      const { page = '1', limit = '50', lang = 'en', search = '' } = ctx.query;

      const methodProperties = {
        Page: page,
        Limit: limit,
        Language: lang,
      };

      if (search) {
        methodProperties.FindByString = search;
      }

      const response = await fetch('https://api.novaposhta.ua/v2.0/json/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey,
          modelName: 'Address',
          calledMethod: 'getCities',
          methodProperties,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        return ctx.badRequest('Помилка при отриманні міст', data.errors);
      }

      ctx.send(data.data);
    } catch (error) {
      ctx.throw(500, 'Помилка при отриманні даних з Нової Пошти');
    }
  },
  async getWarehouses(ctx) {
    try {
      const { cityRef } = ctx.params;
      const { page = '1', limit = '50', search = '' } = ctx.query;
      const apiKey = process.env.NOVA_POSHTA_API_KEY || 'e27e9e15de8916a6eadcfc7bc6559f58';

      const methodProperties = {
        CityRef: cityRef,
        Language: 'ua',
        Page: page,
        Limit: limit,
      };

      if (search) {
        methodProperties.FindByString = search;
      }

      const response = await fetch('https://api.novaposhta.ua/v2.0/json/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey,
          modelName: 'Address',
          calledMethod: 'getWarehouses',
          methodProperties,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        return ctx.badRequest('Помилка при отриманні відділень', data.errors);
      }

      ctx.send(data.data);
    } catch (error) {
      ctx.throw(500, 'Помилка при отриманні даних з Нової Пошти');
    }
  },
};
