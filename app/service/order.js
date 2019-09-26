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
   * @param {String} opts.email - 付款者邮箱
   */
  async create(opts) {
    const { title, description, totalFee, attach, email } = opts
    const { ctx, app } = this
    const { validate, model, config } = app
    const instanceId = ctx.headers['x-instance-id']
    const instanceSecret = ctx.headers['x-instance-secret']
    const instance = await ctx.model.Instance.findOne({ instanceId, instanceSecret })

    if (
      !validate.isString(title) ||
      (!validate.isInt(totalFee) && totalFee > 0) ||
      !validate.isString(email)
    ) {
      return new Error('参数错误')
    }

    if (!validate.isEmail(email)) {
      return new Error('请填写格式正确的邮箱')
    }

    if (!instance) {
      return new Error('实例尚未创建')
    }

    if (instance.status !== config.constants.instanceStatus.normal) {
      return new Error('实例已关闭')
    }

    const countToday = await model.Order.countDocuments({
      instanceId,
      createdTime: { $gte: new Date(moment(new Date()).format('YYYY-MM-DD')) }
    })
    if (countToday >= instance.limit) {
      return new Error('下单失败，今日下单量已达上限')
    }

    const dataObj = {}
    dataObj.email = email
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

  /**
   * 查看订单
   * @param {Object} opts
   * @param {String} opts.number - 订单号
   */
  async dsp(opts = {}) {
    const { number } = opts
    const { validate, model, config } = this.app
    if (!validate.isString(number)) {
      return new Error('参数错误')
    }
    const order = await model.Order.findOne({ number })
    if (!order) {
      return new Error('订单尚未创建')
    }
    const instance = await model.Instance.findOne({ instanceId: order.instanceId })
    if (!instance || instance.status !== config.constants.instanceStatus.normal) {
      return new Error('实例尚未创建或已经关闭')
    }
    const data = {}

    data.title = order.title
    data.description = order.description
    data.instanceName = instance.name
    data.orderNo = order.number
    data.totalFee = order.totalFee
    data.email = order.email
    
    if (order.payTime) {
      data.status = 'pay'
    } else {
      data.weixin = instance.weixin
      data.zhifubao = instance.zhifubao
      data.status = 'create'
    }
    
    return data
  }

  /**
   * 提交付款审核申请
   * @param {Object} opts
   * @param {String} opts.number - 订单号
   */
  async payExamineRequest(opts = {}) {
    const { number } = opts
    const { validate, model, config, sendMail } = this.app
    if (!validate.isString(number)) {
      return new Error('参数错误')
    }
    const order = await model.Order.findOne({ number })

    if (!order) {
      return new Error('该订单尚未创建')
    }
    if (order.cancelTime) {
      return new Error('该订单已经取消')
    }
    if (order.confirmTime) {
      return new Error('该订单已经完成')
    }
    if (order.payTime) {
      return new Error('该订单已经提交过审核了')
    }

    const instance = await model.Instance.findOne({ instanceId: order.instanceId })
    if (!instance) {
      return new Error('实例尚未创建')
    }
    if (instance.status !== config.constants.instanceStatus.normal) {
      return new Error('实例已经关闭')
    }

    const payTime = new Date()
    const data = {}
    data.instance = {}
    data.customer = {}
    data.order = {}
    data.link = {}

    data.instance.name = instance.name
    data.instance.email = instance.email

    data.customer.email = order.email

    data.order.title = order.title
    data.order.totalFee = order.totalFee
    data.order.payTime = moment(payTime).format('YYYY-MM-DD HH:mm:ss')

    data.link.ok = `${config.constants.hostname}/cashier/examine/${instance.id}/${order.id}?action=yes&key=${instance.instanceSecret}`
    data.link.no = `${config.constants.hostname}/cashier/examine/${instance.id}/${order.id}?action=no&key=${instance.instanceSecret}`

    await order.updateOne({ $set: { payTime } })
    await sendMail(instance.callbackEmail, '收到付款通知', 'confirm-order', data)
  }
}

module.exports = OrderService
