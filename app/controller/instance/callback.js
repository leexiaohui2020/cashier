const Controller = require('egg').Controller

class InsatnceCallbackController extends Controller {

  async Test2019() {
    const { ctx } = this
    console.info(ctx.request.body)
    ctx.body = { status: 'ok' }
  }
}

module.exports = InsatnceCallbackController
