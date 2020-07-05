const { Schema, model } = require('mongoose')

const UserSchema = new Schema(
  {
    type: { type: String, default: 'normal' },
    name: String,
    password: String,
    email: { type: String, default: 'user@domain.com' },
    address: { type: String, default: 'TPHCM' },
    avatar: String,
    isEnabled: { type: Boolean, default: true },
    createdAt: { type: Number, default: +new Date() },
  },
  {
    versionKey: false // remove field "__v"
  }
)

module.exports = model('Users', UserSchema)