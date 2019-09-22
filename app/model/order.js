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
    refundTime: { type: Date }
  })

  return mongoose.model('Order', schema, 'Order')
}
