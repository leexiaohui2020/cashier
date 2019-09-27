const fs = require('fs')
const path = require('path')

module.exports = app => ({
  keys: `${app.name}_1566719008112_4418`,
  middleware: ['instanceAuth'],

  instanceAuth: {
    match: '/open-api'
  },

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
    url: 'mongodb://localhost:27017/cashier-dev-v2'
  },

  bodyParser: {
    jsonLimit: '10mb'
  },

  constants: {

    hostname: 'http://127.0.0.1:18081',
    // hostname: 'https://epay.leexiaohui.top',

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
      }
    ],

    instanceStatus: {
      normal: 0,
      forbidden: 1
    },

    instanceFreeLimit: 1
  }
})
