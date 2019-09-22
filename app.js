const fs = require('fs')
const ejs = require('ejs')
const path = require('path')

class AppBootHook {
  constructor(app) {
    this.app = app
  }

  async didReady() {
    const { sendMail, config } = this.app
    // const ejsfile = path.join(config.view.root[0], 'mail/email-active.ejs')
    // await sendMail({
    //   from: '易收银 <lixiaohui2019@sina.cn>',
    //   to: '1287338537@qq.com',
    //   subject: '邮箱激活',
    //   html: ejs.render(fs.readFileSync(ejsfile, 'utf-8'), {
    //     email: '1287338537@qq.com',
    //     href: 'http://www.baidu.com'
    //   })
    // })
  }
}

module.exports = AppBootHook
