const md5 = require('md5')
const nodemailer = require('nodemailer')
const fs = require('fs')
const ejs = require('ejs')
const path = require('path')

exports.validate = (() => {
  const ruleMap = []
  const addRule = (name, validator) => ruleMap.push({ name, validator })

  addRule('isString', v => typeof v === 'string' && v.length > 0)
  addRule('isEmail', v => /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(v))
  addRule('validAccount', v => /^[A-Za-z][A-Za-z0-9\_]{5,}$/.test(v))

  return new Proxy(ruleMap, {
    get(target, key) {
      const item = target.find(v => v.name === key)
      if (!item || typeof item.validator !== 'function') {
        return null
      }
      return item.validator
    }
  })
})()

exports.createSign = (obj = {}) => {
  return md5(
    Object.entries(obj).sort((a, b) => a[0].charCodeAt(0) - b[0].charCodeAt(0)).map(item => `${item[0]}=${item[1]}`).join('&')
  ).toUpperCase()
}

exports.sendMail = (() => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.sina.cn',
    port: 465,
    auth: {
      user: 'lixiaohui2019@sina.cn',
      pass: 'dfaf724bea29db3c'
    }
  })

  return async (to, subject, file, data = {}) => {
    const { config } = this
    const content = fs.readFileSync(path.join(config.view.root[0], `mail/${file}.ejs`), 'utf-8')
    await transporter.sendMail({
      from: '易收银 <lixiaohui2019@sina.cn>',
      to,
      subject,
      html: ejs.render(content, data)
    })
  }
})()
