const Controller = require('egg').Controller

class InstanceApiController extends Controller {

  /** 获取实例套餐 */
  async getPack() {
    const { ctx } = this
    const data = await ctx.service.instance.getPack()
    ctx.body = { status: 'ok', data }
  }

  /** 创建实例 */
  async create() {
    const { ctx } = this
    const data = await ctx.service.instance.create(ctx.request.body)
    if (data instanceof Error) {
      ctx.body = { status: 'err', errmsg: data.message }
    } else {
      ctx.body = { status: 'ok' }
    }
  }
}

module.exports = InstanceApiController
