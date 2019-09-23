const Service = require('egg').Service

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
}

module.exports = InstanceService
