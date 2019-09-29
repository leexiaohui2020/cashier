const Service = require('egg').Service

class UserService extends Service {

  /**
   * 注册用户
   * @param {Object} opts 
   * @param {String} opts.username - 用户名
   * @param {String} opts.password - 密码
   * @param {String} opts.email - 邮箱
   * @param {String} opts.code - 验证码
   */
  async regist(opts = {}) {
    const { username, password, email, code } = opts
    const { validate, model } = this.app
    const { ctx } = this

    if (
      !validate.isString(username) ||
      !validate.isString(password) ||
      !validate.isString(email) ||
      !validate.isString(code)
    ) {
      return new Error('参数错误')
    }

    if (ctx.session.code !== code || ctx.session.codeEmail !== email) {
      return new Error('验证码错误')
    }

    if (!validate.validAccount(username)) {
      return new Error('用户名长度至少六位，且只能填写字母数字和下划线，开头必须是字母')
    }
    if (!validate.validAccount(password)) {
      return new Error('密码长度至少六位，且只能填写字母数字和下划线，开头必须是字母')
    }
    if (!validate.isEmail(email)) {
      return new Error('邮箱格式不正确')
    }

    if (await model.User.findOne({ username })) {
      return new Error('用户名已经被注册')
    }
    if (await model.User.findOne({ email })) {
      return new Error('邮箱已经被使用')
    }

    await model.User.create({
      email,
      username,
      password,
      createdTime: new Date(),
      activeTime: new Date()
    })
  }

  /**
   * 会员登录
   * @param {Object} opts
   * @param {String} opts.account - 用户名/邮箱
   * @param {String} opts.password - 密码
   * @param {String} opts.code - 验证码
   */
  async login(opts = {}) {
    const { account, password, code } = opts
    const { ctx, app } = this
    const { validate, model } = app

    if (
      !validate.isString(account) ||
      !validate.isString(password) ||
      !validate.isString(code)
    ) {
      return new Error('参数错误')
    }


    const user = await model.User.findOne({}).or([
      { username: account },
      { email: account }
    ])
    if (!user) {
      return new Error('用户尚未注册')
    }
    if (user.password !== password) {
      return new Error('密码错误')
    }
    if (ctx.session.code !== code || ctx.session.codeEmail !== user.email) {
      return new Error('验证码错误')
    }

    const uid = user._id
    const { username, email, createdTime, activeTime } = user
    const data = ctx.session['store/user'] = {
      uid,
      userInfo: {
        username,
        email,
        createdTime,
        activeTime
      }
    }
    return data
  }

  /**
   * 获取邮箱验证码
   * @param {Object} opts
   * @param {String} opts.email - 邮箱
   * @param {String} opts.body - 场景描述
   */
  async getCode(opts = {}) {
    const { email, body } = opts
    const { ctx, app } = this
    const { validate, sendMail } = app

    if (!validate.isString(email) || !validate.isString(body)) {
      return new Error('参数错误')
    }
    if (!validate.isEmail(email)) {
      return new Error('请填写正确的邮箱')
    }

    const code = String(Math.random()).substr(2, 6)
    ctx.session.code = code
    ctx.session.codeEmail = email
    await sendMail(email, '[易收银] 请查收您的验证码', 'validcode', {
      code,
      email,
      body
    })
  }

  /**
   * 发送验证码2
   * @param {Object} opts
   * @param {String} opts.account - 可以是用户名或邮箱
   * @param {String} opts.body - 场景描述
   */
  async getCodeByAccount(opts = {}) {
    const { account, body } = opts
    const { model } = this.app
    const user = await model.User.findOne({}).or([
      { username: account },
      { email: account }
    ])
    if (!user) {
      return new Error('用户尚未注册')
    }
    const { email } = user
    return await this.getCode({ email, body })
  }

  /**
   * 身份校验
   * @param {Object} opts 
   * @param {String} opts.password - 登录密码
   */
  async checkAuth(opts = {}) {
    const { password } = opts
    const { ctx, app } = this
    const { model } = app
    const userStore = ctx.session['store/user']
    if (!userStore || !userStore.uid) {
      return new Error('请登录')
    }

    const user = await model.User.findOne({ _id: userStore.uid })
    if (!user) {
      return new Error('用户尚未注册')
    }
    if (user.password !== password) {
      return new Error('密码错误')
    }
  }

  /**
   * 退出登录
   */
  async logout() {
    const { ctx } = this
    delete ctx.session['store/user']
  }
}

module.exports = UserService
