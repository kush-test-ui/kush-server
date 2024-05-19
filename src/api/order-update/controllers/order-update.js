'use strict';

module.exports = {
  updateOrder: async (ctx) => {
    const { paymentIntentID } = ctx.request.body;

    const order = await strapi.query("api::order.order").findOne({ 
      where:{ paymentIntentID } 
    });

    if (!order) {
      return ctx.notFound("Order not found");
    }

    const updatedOrder = await strapi.query("api::order.order").update({
      where:{ id:order.id },
      data:{
        ...order,
        status:'confirmed'
      },
    });

    return ctx.send({ status:200, message:'Transaction complete', order:updatedOrder });
  },
}
