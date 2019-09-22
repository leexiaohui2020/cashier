module.exports = ({ mongoose }) => {
  const schema = new mongoose.Schema({
    username: { type: String, index: true, unique: true, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    activeTime: { type: Date },
    createdTime: { type: Date }
  })

  return mongoose.model('User', schema, 'User')
}
