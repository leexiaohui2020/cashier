const Controller = require('egg').Controller

class OrderOPControler extends Controller {

  // 创建订单
  async create() {
    const { ctx } = this
    const data = await ctx.service.order.create(ctx.request.body)
    if (data instanceof Error) {
      ctx.body = { status: 'err', errmsg: data.message }
    } else {
      ctx.body = { status: 'ok', data }
    }
  }
}

module.exports = OrderOPControler
