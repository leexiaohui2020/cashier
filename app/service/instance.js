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
    const freeCount = await model.Instance.countDocuments({ userId, limit })
    if (freeCount >= config.constants.instanceFreeLimit) {
      return new Error('您可创建的免费实例已达上限')
    }

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

  /**
   * 实例详情
   * @param {Object} opts
   * @param {String} opts.isid - 实例id
   */
  async dsp(opts = {}) {
    const { isid } = opts
    const { ctx, app } = this
    const { model, config, createSign } = app
    const userSession = ctx.session['store/user']

    if (!userSession || !await model.User.findOne({ _id: userSession.uid })) {
      return new Error('请登录')
    }

    const instance = await model.Instance.findOne({ _id: isid })
    if (!instance) {
      return new Error('实例未创建')
    }
    if (instance.userId !== userSession.uid) {
      return new Error('您没有权限浏览该实例')
    }

    const pack = config.constants.instancePack.find(item => item.limit === instance.limit)
    const statusMap = [{ text: '正常使用', color: 'success' }, { text: '停止使用', color: 'error' }]
    const checkUrl = instance.callbackUrl ? await this.checkCallbackUrl({
      url: instance.callbackUrl,
      data: {
        sign: createSign({ id: instance.instanceId, secret: instance.instanceSecret })
      }
    }) : 'none'

    const countOrder = {}
    countOrder.today = await model.Order.countDocuments({
      instanceId: instance.instanceId,
      createdTime: { $gte: new Date(moment(new Date()).format('YYYY-MM-DD'))}
    })
    countOrder.tomonth = await model.Order.countDocuments({
      instanceId: instance.instanceId,
      createdTime: { $gte: new Date(moment(new Date()).format('YYYY-MM'))}
    })

    return Object.assign({}, instance.toJSON(), {
      packName: pack.name,
      statusMap: statusMap[instance.status],
      expireDay: Math.max(0, moment(instance.expireTime).diff(new Date(), 'day')),
      weixinSetting: !!(instance.weixin && instance.weixin.qrcode),
      zhifubaoSetting: !!(instance.zhifubao && instance.zhifubao.qrcode),
      callbackUrlCanUse: checkUrl !== 'none' && !(checkUrl instanceof Error),
      countOrder
    })
  }

  /**
   * 微信收款设置
   * @param {Object} opts
   * @param {String} opts.number - 收款账号
   * @param {String} opts.qrcode - 收款二维码，base64编码
   * @param {String} opts.isid - 实例id
   */
  async setWeixin(opts = {}) {
    const { number, qrcode, isid } = opts
    const { ctx, app } = this
    const { validate, model, Image } = app

    if (
      !validate.isString(qrcode) ||
      !validate.isString(isid)
    ) {
      return new Error('参数错误')
    }

    const userStore = ctx.session['store/user']
    if (!userStore || !userStore.uid) {
      return new Error('请登录')
    }

    const instance = await model.Instance.findOne({ _id: isid })
    if (!instance) {
      return new Error('实例尚未创建')
    }
    if (instance.userId !== userStore.uid) {
      return new Error('您没有操作权限')
    }

    Image.remove(instance.weixin.qrcode)
    const fileName = Image.save(qrcode)
    const $set = { 'weixin.qrcode': fileName }
    if (number) {
      $set['weixin.number'] = number
    }
    await instance.updateOne({ $set })
  }

  /**
   * 支付宝收款设置
   * @param {Object} opts
   * @param {String} opts.number - 收款账号
   * @param {String} opts.qrcode - 收款二维码，base64编码
   * @param {String} opts.isid - 实例id
   */
  async setZhifubao(opts = {}) {
    const { number, qrcode, isid } = opts
    const { ctx, app } = this
    const { validate, model, Image } = app

    if (
      !validate.isString(qrcode) ||
      !validate.isString(isid)
    ) {
      return new Error('参数错误')
    }

    const userStore = ctx.session['store/user']
    if (!userStore || !userStore.uid) {
      return new Error('请登录')
    }

    const instance = await model.Instance.findOne({ _id: isid })
    if (!instance) {
      return new Error('实例尚未创建')
    }
    if (instance.userId !== userStore.uid) {
      return new Error('您没有操作权限')
    }

    Image.remove(instance.zhifubao.qrcode)
    const fileName = Image.save(qrcode)
    const $set = { 'zhifubao.qrcode': fileName }
    if (number) {
      $set['zhifubao.number'] = number
    }
    await instance.updateOne({ $set })
  }

  /**
   * 邮箱换绑
   * @param {Object} opts 
   * @param {String} opts.email - 新邮箱
   * @param {String} opts.code - 验证码
   * @param {String} opts.isid
   */
  async changeEmail(opts = {}) {
    const { code, email, isid } = opts
    const { ctx, app } = this
    const { validate, model } = app

    if (
      !validate.isString(code) ||
      !validate.isString(email) ||
      !validate.isString(isid)
    ) {
      return new Error('参数错误')
    }

    if (!validate.isEmail(email)) {
      return new Error('邮箱格式错误')
    }

    const userStore = ctx.session['store/user']
    if (!userStore || !userStore.uid) {
      return new Error('请登录')
    }

    if (code !== ctx.session.code) {
      return new Error('验证码错误')
    }

    const instance = await model.Instance.findOne({ _id: isid })
    if (!instance) {
      return new Error('实例尚未创建')
    }
    if (instance.userId !== userStore.uid) {
      return new Error('您没有操作权限')
    }
    if (instance.callbackEmail === email) {
      return new Error('请使用新邮箱')
    }
    if (await model.Instance.findOne({ callbackEmail: email })) {
      return new Error('邮箱已绑定了其他实例')
    }

    await instance.updateOne({
      $set: {
        callbackEmail: email
      }
    })
  }

  /**
   * 验证回调地址
   * @param {Object} opts 
   * @param {String} opts.url
   * @param {Object} opts.data
   */
  async checkCallbackUrl(opts = {}) {
    const { url, data = {} } = opts
    const { ctx, app } = this
    const { validate } = app

    if (!validate.isString(url)) {
      return new Error('参数错误')
    }
    if (!/^https?\:\/\//.test(url)) {
      return new Error('地址错误')
    }
    
    let res
    try {
      res = await ctx.curl(url, {
        method: 'POST',
        dataType: 'json',
        contentType: 'json',
        data: {
          type: 'check',
          ...data
        }
      })
    } catch(e) {
      app.logger.info(e.message)
      return new Error('验证失败')
    }

    if (res.status !== 200) {
      return new Error('验证失败')
    }

    if (res.data.status !== 'ok') {
      return new Error('验证失败')
    }
  }

  /**
   * 更换回调地址
   * @param {Object} opts 
   * @param {String} opts.url - 回调地址
   * @param {String} opts.isid
   */
  async changeCallbackUrl(opts = {}) {
    const { url, isid } = opts
    const { ctx, app } = this
    const { validate, model, createSign } = app

    if (
      !validate.isString(url) ||
      !validate.isString(isid)
    ) {
      return new Error('参数错误')
    }

    const userStore = ctx.session['store/user']
    if (!userStore || !userStore.uid) {
      return new Error('请登录')
    }

    const instance = await model.Instance.findOne({ _id: isid })
    if (!instance) {
      return new Error('实例尚未创建')
    }
    if (instance.userId !== userStore.uid) {
      return new Error('您没有操作权限')
    }

    const sign = createSign({ id: instance.instanceId, secret: instance.instanceSecret })
    const res = await this.checkCallbackUrl({ url, data: { sign } })
    if (res instanceof Error) {
      return res
    }

    await instance.updateOne({ $set: { callbackUrl: url } })
  }

  /**
   * 关闭实例
   * @param {Object} opts
   * @param {String} opts.isid
   */
  async pause(opts = {}) {
    const { isid } = opts
    const { ctx, app } = this
    const { model, config } = app
    const userStore = ctx.session['store/user']
    if (!userStore || !userStore.uid) {
      return new Error('请登录')
    }
    const instance = await model.Instance.findOne({ _id: isid })
    if (!instance) {
      return new Error('实例尚未创建')
    }
    if (instance.userId !== userStore.uid) {
      return new Error('您没有操作权限')
    }
    await instance.updateOne({
      $set: { status: config.constants.instanceStatus.forbidden }
    })
  }

  /**
   * 开启实例
   * @param {Object} opts
   * @param {String} opts.isid
   */
  async start(opts = {}) {
    const { isid } = opts
    const { ctx, app } = this
    const { model, config } = app
    const userStore = ctx.session['store/user']
    if (!userStore || !userStore.uid) {
      return new Error('请登录')
    }
    const instance = await model.Instance.findOne({ _id: isid })
    if (!instance) {
      return new Error('实例尚未创建')
    }
    if (instance.userId !== userStore.uid) {
      return new Error('您没有操作权限')
    }

    if (!instance.weixin.qrcode) {
      return new Error('请设置微信收款信息')
    }
    if (!instance.zhifubao.qrcode) {
      return new Error('请设置支付宝收款信息')
    }

    await instance.updateOne({
      $set: { status: config.constants.instanceStatus.normal }
    })
  }
}

module.exports = InstanceService
