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
      normal: 100,
      silver: 500,
      honor: 1000,
      infinite: 0
    },

    instanceStatus: {
      normal: 0,
      forbidden: 1
    }
  }
})
