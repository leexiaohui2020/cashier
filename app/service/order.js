const Service = require('egg').Service
const moment = require('moment')

class OrderService extends Service {

  /**
   * 创建订单
   * @param {Object} opts
   * @param {String} opts.title - 商品名称
   * @param {String} opts.description - 商品详情
   * @param {Number} opts.totalFee - 应付金额
   * @param {String} opts.attach - 附属信息
   */
  async create(opts) {
    const { title, description, totalFee, attach } = opts
    const { ctx, app } = this
    const { validate, model } = app
    const instanceId = ctx.headers['x-instance-id']
    const instanceSecret = ctx.headers['x-instance-secret']
    const instance = await ctx.model.Instance.findOne({ instanceId, instanceSecret })

    if (!instance) {
      return new Error('实例尚未创建')
    }

    if (
      !validate.isString(title) ||
      (!validate.isInt(totalFee) && totalFee > 0)
    ) {
      return new Error('参数错误')
    }

    const countToday = await model.Order.countDocuments({
      instanceId,
      createdTime: { $gte: new Date(moment(new Date()).format('YYYY-MM-DD')) }
    })
    if (countToday >= instance.limit) {
      return new Error('下单失败，今日下单量已达上限')
    }

    const dataObj = {}
    dataObj.instanceId = instanceId
    dataObj.title = title
    dataObj.totalFee = totalFee
    dataObj.createdTime = new Date()
    dataObj.number = await model.Order.createNumber(instanceId)

    if (attach) dataObj.attach = attach
    if (description) dataObj.description = description

    const order = await model.Order.create(dataObj)
    return { number: order.number }
  }
}

module.exports = OrderService
