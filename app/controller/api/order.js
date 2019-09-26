const Controller = require('egg').Controller

class OrderControler extends Controller {

  // 查询订单
  async dsp() {
    const { ctx } = this
    const data = await ctx.service.order.dsp(ctx.request.body)
    if (data instanceof Error) {
      ctx.body = { status: 'err', errmsg: data.message }
    } else {
      ctx.body = { status: 'ok', data }
    }
  }

  // 提交付款检查
  async payExamineRequest() {
    const { ctx } = this
    const data = await ctx.service.order.payExamineRequest(ctx.request.body)
    if (data instanceof Error) {
      ctx.body = { status: 'err', errmsg: data.message }
    } else {
      ctx.body = { status: 'ok', data }
    }
  }
}

module.exports = OrderControler
