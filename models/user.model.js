const { Schema, model } = require('mongoose')

const UserSchema = new Schema(
  {
    type: { type: String, default: 'employee' }, // or admin
    name: String,
    password: String,
    email: { type: String, default: 'user@domain.com' },
    address: { type: String, default: 'TPHCM' },
    avatar: String,
    isEnabled: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Number, default: +new Date() },
    createdBy: { type: String, default: 'admin' },
  },
  {
    versionKey: false // remove field "__v"
  }
)

module.exports = model('Users', UserSchema)