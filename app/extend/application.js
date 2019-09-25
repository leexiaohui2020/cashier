const fs = require('fs')
const ejs = require('ejs')
const md5 = require('md5')
const path = require('path')
const nodemailer = require('nodemailer')

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
    const content = fs.readFileSync(path.join(__dirname, `../view/mail/${file}.ejs`), 'utf-8')
    await transporter.sendMail({
      from: '易收银 <lixiaohui2019@sina.cn>',
      to,
      subject,
      html: ejs.render(content, data)
    })
  }
})()

exports.Image = (() => {

  const ensureFolder = dir => {
    if (fs.existsSync(dir)) {
      return
    }
    ensureFolder(path.dirname(dir))
    fs.mkdirSync(dir)
  }

  const save = base64Data => {
    const data = Buffer.from(base64Data.split(',')[1], 'base64')
    const fileName = exports.createSign({ base64Data, timeStamps: Date.now() }) + '.png'
    const fileDir = path.join(__dirname, `../upload/image`)
    ensureFolder(fileDir)
    fs.writeFileSync(path.join(fileDir, fileName), data)
    return fileName
  }

  const remove = fileName => {
    const filePath = path.join(__dirname, `../upload/image/${fileName}`)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  }

  const get = fileName => {
    const filePath = path.join(__dirname, `../upload/image/${fileName}`)
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath)
    }
    return new Error('文件不存在')
  }

  return {
    get,
    save,
    remove
  }
})()
