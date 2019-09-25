const fs = require('fs')
const ejs = require('ejs')
const path = require('path')

class AppBootHook {
  constructor(app) {
    this.app = app
  }

  async didReady() {
    // const ctx = await this.app.createAnonymousContext()
    // const { data } = await ctx.curl('http://localhost:18081/open-api/order/create', {
    //   method: 'POST',
    //   headers: {
    //     'x-instance-id': 'CFA60E8E18D80CBA909967EE0B2C90A2',
    //     'x-instance-secret': '3177EC92ED14A2E384D4FE1F66CDDD0F'
    //   },
    //   dataType: 'json',
    //   contentType: 'json',
    //   data: {
    //     title: '支付测试',
    //     totalFee: 1
    //   }
    // })
    // console.info(data)
  }
}

module.exports = AppBootHook
