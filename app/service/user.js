const Service = require('egg').Service

class UserService extends Service {

  /**
   * 注册用户
   * @param {Object} opts 
   * @param {String} opts.username - 用户名
   * @param {String} opts.password - 密码
   * @param {String} opts.email - 邮箱
   */
  async regist(opts = {}) {
    const { username, password, email } = opts
    const { validate, model, sendMail } = this.app

    if (
      !validate.isString(username) ||
      !validate.isString(password) ||
      !validate.isString(email)
    ) {
      return new Error('参数错误')
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
      createdTime: new Date()
    })

    await sendMail(email, '激活邮箱', 'active-email', {
      email,
      href: ''
    })
  }

  /**
   * 激活邮箱
   * @param {Object} opts 
   * @param {String} opts._id - 用户id
   * @param {String} opts.username - 用户名
   * @param {String} opts.email - 邮箱
   * @param {String} opts.sign - 校验签名
   */
  async activeEmail(opts = {}) {
    const { _id, username, email, sign } = opts
    const { validate, createSign, model } = this.app

    if (
      !validate.isString(_id) ||
      !validate.isString(username) ||
      !validate.isString(email) ||
      !validate.isString(sign)
    ) {
      return new Error('参数错误')
    }

    if (createSign({ _id, username, email }) !== sign) {
      return new Error('校验错误')
    }

    const user = await model.User.findOne({ _id, email, username })
    if (!user) {
      return new Error('用户尚未注册')
    }
    if (user.activeTime) {
      return new Error('邮箱已经激活过了')
    }

    await user.updateOne({
      $set: {
        activeTime: new Date()
      }
    })
  }
}

module.exports = UserService
