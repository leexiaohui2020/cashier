const Controller = require('egg').Controller

class UserApiController extends Controller {

  /** 获取邮箱验证码 */
  async getCode() {
    const { ctx } = this
    const data = await ctx.service.user.getCode(ctx.request.body)
    if (data instanceof Error) {
      ctx.body = { status: 'err', errmsg: data.message }
    } else {
      ctx.body = { status: 'ok' }
    }
  }

  /** 获取邮箱验证码2 */
  async sendCodeByAccount() {
    const { ctx } = this
    const data = await ctx.service.user.getCodeByAccount(ctx.request.body)
    if (data instanceof Error) {
      ctx.body = { status: 'err', errmsg: data.message }
    } else {
      ctx.body = { status: 'ok' }
    }
  }

  /** 注册会员 */
  async regist() {
    const { ctx } = this
    const data = await ctx.service.user.regist(ctx.request.body)
    if (data instanceof Error) {
      ctx.body = { status: 'err', errmsg: data.message }
    } else {
      ctx.body = { status: 'ok' }
    }
  }

  /** 会员登录 */
  async login() {
    const { ctx } = this
    const data = await ctx.service.user.login(ctx.request.body)
    if (data instanceof Error) {
      ctx.body = { status: 'err', errmsg: data.message }
    } else {
      ctx.body = { status: 'ok', data }
    }
  }
  
  /** 身份校验 */
  async checkAuth() {
    const { ctx } = this
    const data = await ctx.service.user.checkAuth(ctx.request.body)
    if (data instanceof Error) {
      ctx.body = { status: 'err', errmsg: data.message }
    } else {
      ctx.body = { status: 'ok', data }
    }
  }

  /** 登出 */
  async logout() {
    const { ctx } = this
    await ctx.service.user.logout()
    ctx.body = { status: 'ok' }
  }
}

module.exports = UserApiController
