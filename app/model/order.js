const md5 = require('md5')
const moment = require('moment')

module.exports = ({ mongoose }) => {
  const schema = new mongoose.Schema({
    instanceId: { type: String, required: true },
    number: { type: String, index: true, unique: true, required: true },
    title: { type: String, required: true },
    description: { type: String },
    totalFee: { type: Number, required: true },
    attached: { type: String },
    createdTime: { type: Date },
    payTime: { type: Date },
    confirmTime: { type: Date },
    cancelTime: { type: Date },
    refundTime: { type: Date },
    email: { type: String, required: true }
  })

  schema.static({
    
    async createNumber(isid) {
      const prefix = moment(new Date()).format('YYYYMMDDHHMMss')
      const randomStr = String(Math.random()).substr(2, 4)
      const suffix = md5(isid).toUpperCase().substr(0, 4)
      const count = await this.countDocuments({
        instanceId: isid,
        createdTime: {
          $gte: new Date(moment(new Date).format('YYYY-MM-DD'))
        }
      })
      const countStr = String(1000000 + count).substr(-4)
      return prefix + randomStr + suffix + countStr
    }
  })

  schema.virtual('status').get(function () {
    if (this.refundTime) return 'refund'
    if (this.cancelTime) return 'cancel'
    if (this.confirmTime) return 'confirm'
    if (this.payTime) return 'pay'
    return 'create'
  })

  return mongoose.model('Order', schema, 'Order')
}
