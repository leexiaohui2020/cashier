const fs = require('fs')
const path = require('path')

module.exports = app => ({
  keys: `${app.name}_1566719008112_4418`,
  middleware: [],

  vuessr: {
    layout: path.join(app.baseDir, 'app/web/index.html'),
    renderOptions: {
      baseDir: path.join(app.baseDir, 'app/view')
    }
  },

  cluster: {
    listen: {
      port: 18081
    }
  },

  security: {
    csrf: false
  },

  static: {
    prefix: '/public/',
    dir: path.join(app.baseDir, 'public')
  },

  siteFile: {
    '/favicon.ico': fs.readFileSync(path.join(app.baseDir, 'app/web/common/asset/favicon.ico'))
  },

  mongoose: {
    url: 'mongodb://localhost:27017/cashier-dev-v1'
  },

  constants: {

    hostname: 'http://www.baidu.com',

    MONGO_OPTIONS: {
      timestamps: {
        created_at: 'createdAt',
        updated_at: 'updatedAt'
      }
    },

    instanceLevel: {
      normal: 50,
      silver: 500,
      honor: 2000,
      infinite: 0
    },

    instancePack: [
      {
        id: 'normal',
        name: '免费套餐',
        price: 0,
        limit: 50
      },
      // {
      //   id: 'silver',
      //   name: '白银套餐',
      //   price: 1900,
      //   limit: 500
      // },
      // {
      //   id: 'honor',
      //   name: '至尊套餐',
      //   price: 5900,
      //   limit: 2000
      // },
      // {
      //   id: 'infinite',
      //   name: '无限套餐',
      //   price: 9900,
      //   limit: 0
      // }
    ],

    instanceStatus: {
      normal: 0,
      forbidden: 1
    }
  }
})
