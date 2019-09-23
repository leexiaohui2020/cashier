const Service = require('egg').Service
const moment = require('moment')

class InstanceService extends Service {

  /** 获取套餐 */
  async getPack() {
    const { config } = this.app
    const { instancePack } = config.constants
    const data = instancePack.map(item => Object.assign({}, item, {
      price: `￥${item.price / 100}`,
      limit: item.limit ? item.limit : '不限'
    }))
    return data
  }

  /**
   * 创建实例
   * @param {Object} opts
   * @param {String} opts.name - 实例名称
   * @param {String} opts.description - 实例描述
   * @param {String} opts.callbackEmail - 通知邮箱
   * @param {String} opts.packId - 套餐id
   * @param {String} opts.code - 验证码
   * @param {String} opts.uid - 用户id
   */
  async create(opts = {}) {
    const { name, description, callbackEmail, packId, code, uid } = opts
    const { ctx, app } = this
    const { validate, config, model, createSign } = app

    if (
      !validate.isString(name) ||
      !validate.isString(callbackEmail) ||
      !validate.isString(packId) ||
      !validate.isString(code)
    ) {
      return new Error('参数错误')
    }
    if (ctx.session.code !== code) {
      return new Error('验证码错误')
    }
    if (!validate.isEmail(callbackEmail)) {
      return new Error('邮箱格式不正确')
    }

    if (!await model.User.findOne({ _id: uid })) {
      return new Error('请登录')
    }

    const pack = config.constants.instancePack.find(item => item.id === packId)
    if (!pack) {
      return new Error('请选择套餐')
    }
    if (pack.price > 0) {
      return new Error('暂不支持付费套餐')
    }

    if (await model.Instance.findOne({ callbackEmail })) {
      return new Error('邮箱已经绑定了其他实例')
    }

    const userId = uid
    const limit = pack.limit
    const dataObj = { name, callbackEmail, userId, limit }
    dataObj.createdTime = new Date()
    dataObj.expireTime = new Date()
    dataObj.expireTime.setDate(dataObj.expireTime.getDate() + 30)
    dataObj.description = description || ''

    dataObj.instanceId = createSign(dataObj)
    dataObj.instanceSecret = createSign(dataObj)

    await model.Instance.create(dataObj)
  }

  /**
   * 实例列表
   * @param {Object} opts
   * @param {String} opts.uid - 用户id
   * @param {Object} opts.pager - 分页器
   * @param {Number} opts.pager.page - 分页
   * @param {Number} opts.pager.pagesize - 条数
   */
  async lst(opts = {}) {
    const { uid, pager = {} } = opts
    const { page = 1, pagesize = 10 } = pager
    const { model } = this.app
    
    const total = await model.Instance.countDocuments({ userId: uid })
    const source = await model.Instance.find({ userId: uid }).skip((page - 1) * pagesize).limit(pagesize).sort({ createdTime: -1 })
    const list = source.map(item => ({
      id: item._id,
      name: item.name,
      description: item.description,
      limit: item.limit,
      limitText: `每日订单上限：${item.limit ? `${item.limit}笔` : '无限制' }`,
      callbackEmail: item.callbackEmail,
      callbackUrl: item.callbackUrl,
      createdTime: moment(item.createdTime).format('YYYY-MM-DD HH:mm'),
      expireTime: moment(item.expireTime).format('YYYY-MM-DD HH:mm'),
      expireText: `过期时间：${moment(item.expireTime).diff(new Date(), 'day')}天后`,
      status: item.status,
      statusText: [ '正常', '停用' ][item.status],
      statusColor: [ 'success', 'error' ][item.status]
    }))
    return { page, pagesize, total, list }
  }
}

module.exports = InstanceService
