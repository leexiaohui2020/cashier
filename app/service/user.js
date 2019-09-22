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

    if (ctx.session.code !== code) {
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
   * 获取邮箱验证码
   * @param {Object} opts
   * @param {String} opts.email - 邮箱
   */
  async getCode(opts = {}) {
    const { email } = opts
    const { ctx, app } = this
    const { validate, sendMail } = app

    if (!validate.isString(email)) {
      return new Error('参数错误')
    }
    if (!validate.isEmail(email)) {
      return new Error('请填写正确的邮箱')
    }

    const code = String(Math.random()).substr(2, 6)
    ctx.session.code = code
    await sendMail(email, '[易收银] 请查收您的验证码', 'validcode', {
      code,
      email
    })
  }
}

module.exports = UserService
