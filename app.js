const fs = require('fs')
const ejs = require('ejs')
const path = require('path')

class AppBootHook {
  constructor(app) {
    this.app = app
  }

  async didReady() {
    const ctx = await this.app.createAnonymousContext()
    const createOrder = async () => {
      const { data } = await ctx.curl('http://localhost:18081/open-api/order/create', {
        method: 'POST',
        headers: {
          'x-instance-id': 'D6EB0D95B8D1CF7AD9E0702F8C91FB0D',
          'x-instance-secret': '727650FD130671434BFCFF7974A3536E'
        },
        dataType: 'json',
        contentType: 'json',
        data: {
          title: '酷狗豪华VIP',
          totalFee: 1500,
          email: 'lixiaohui2019@sina.cn',
          description: '酷狗豪华VIP15元/月'
        }
      })
      console.info(data)
    }
    const sendEmail = async () => {
      this.app.sendMail('1287338537@qq.com', '收到付款通知', 'confirm-order', {
        instance: { email: '1287338537@qq.com', name: '易收银' },
        customer: { email: 'lixiaohui2019@sina.cn' },
        order: { title: '酷狗豪华VIP', totalFee: 1500, payTime: '2019-09-26 17:22', number: '201909261722' }
      })
    }

    // createOrder()
  }
}

module.exports = AppBootHook
