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

  /** 查询实例列表 */
  async lst() {
    const { ctx } = this
    const data = await ctx.service.instance.lst(ctx.request.body)
    if (data instanceof Error) {
      ctx.body = { status: 'err', errmsg: data.message }
    } else {
      ctx.body = { status: 'ok', data }
    }
  }

  /** 查询实例详情 */
  async dsp() {
    const { ctx } = this
    const data = await ctx.service.instance.dsp(ctx.request.body)
    if (data instanceof Error) {
      ctx.body = { status: 'err', errmsg: data.message }
    } else {
      ctx.body = { status: 'ok', data }
    }
  }
  
  /** 微信收款设置 */
  async setWeixin() {
    const { ctx } = this
    const data = await ctx.service.instance.setWeixin(ctx.request.body)
    if (data instanceof Error) {
      ctx.body = { status: 'err', errmsg: data.message }
    } else {
      ctx.body = { status: 'ok', data }
    }
  }
  
  /** 支付宝收款设置 */
  async setZhifubao() {
    const { ctx } = this
    const data = await ctx.service.instance.setZhifubao(ctx.request.body)
    if (data instanceof Error) {
      ctx.body = { status: 'err', errmsg: data.message }
    } else {
      ctx.body = { status: 'ok', data }
    }
  }
  
  /** 邮箱换绑 */
  async changeEmail() {
    const { ctx } = this
    const data = await ctx.service.instance.changeEmail(ctx.request.body)
    if (data instanceof Error) {
      ctx.body = { status: 'err', errmsg: data.message }
    } else {
      ctx.body = { status: 'ok', data }
    }
  }
   
  /** 更换回调地址 */
  async changeCallbackUrl() {
    const { ctx } = this
    const data = await ctx.service.instance.changeCallbackUrl(ctx.request.body)
    if (data instanceof Error) {
      ctx.body = { status: 'err', errmsg: data.message }
    } else {
      ctx.body = { status: 'ok', data }
    }
  }
    
  /** 打开实例 */
  async start() {
    const { ctx } = this
    const data = await ctx.service.instance.start(ctx.request.body)
    if (data instanceof Error) {
      ctx.body = { status: 'err', errmsg: data.message }
    } else {
      ctx.body = { status: 'ok', data }
    }
  }  

  /** 停用实例 */
  async pause() {
    const { ctx } = this
    const data = await ctx.service.instance.pause(ctx.request.body)
    if (data instanceof Error) {
      ctx.body = { status: 'err', errmsg: data.message }
    } else {
      ctx.body = { status: 'ok', data }
    }
  }
}

module.exports = InstanceApiController
