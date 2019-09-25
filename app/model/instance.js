module.exports = ({ mongoose, config }) => {
  const { instanceLevel, instanceStatus } = config.constants
  const schema = new mongoose.Schema({
    userId: { type: String, required: true },
    instanceId: { type: String, index: true, unique: true, required: true },
    instanceSecret: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    limit: { type: Number, default: instanceLevel.normal },
    weixin: {
      number: { type: String },
      qrcode: { type: String }
    },
    zhifubao: {
      number: { type: String },
      qrcode: { type: String }
    },
    callbackUrl: { type: String },
    callbackEmail: { type: String, required: true },
    createdTime: { type: Date },
    expireTime: { type: Date },
    status: { type: Number, default: instanceStatus.normal }
  })

  return mongoose.model('Instance', schema, 'Instance')
}
