module.exports = () => {

  return async function(ctx, next) {
    const instanceId = ctx.headers['x-instance-id']
    const instanceSecret = ctx.headers['x-instance-secret']
    const instance = await ctx.model.Instance.findOne({ instanceId, instanceSecret })
    if (!instance) {
      ctx.body = { status: 'err', errmsg: '校验失败' }
      return
    }
    await next()
  }
}
