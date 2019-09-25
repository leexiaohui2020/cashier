const Controller = require('egg').Controller

class AppController extends Controller {

  async index() {
    const { ctx } = this
    const { url } = ctx
    const session = ctx.session
    await ctx.render('app.js', { ctx, url, session })
  }

  async image() {
    const { ctx, app } = this
    const { filename } = ctx.params
    const data = app.Image.get(filename)
    if (data instanceof Error) {
      ctx.status = 404
      ctx.body = { status: 'err', errmsg: data.message }
    } else {
      ctx.status = 200
      ctx.type = 'image/png'
      ctx.body = data
    }
  }
}

module.exports = AppController
