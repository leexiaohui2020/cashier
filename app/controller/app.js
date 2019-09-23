const Controller = require('egg').Controller

class AppController extends Controller {

  async index() {
    const { ctx } = this
    const { url } = ctx
    const session = ctx.session
    await ctx.render('app.js', { ctx, url, session })
  }
}

module.exports = AppController
