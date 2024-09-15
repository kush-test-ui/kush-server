'use strict';

module.exports = {
  updateOrder: async (ctx) => {
    return ctx.send({
      status: 200,
      message: 'Transaction complete',
      order: 'asd',
    });
  },
};
