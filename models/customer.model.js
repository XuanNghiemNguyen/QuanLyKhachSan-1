const { Schema, model } = require('mongoose')

const CustomerSchema = new Schema(
  {
    name: {
      type: String,
      uppercase: true,
      trim: true,
      minlength: 1,
      maxlength: 255,
      required: true
    },
    gender: { type: String, maxlength: 10, default: 'Nam' },
    address:  {
      type: String,
      trim: true,
      maxlength: 255
    },
    customerTypeId: Schema.Types.ObjectId,
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Number, default: Date.now() },
    createdBy: Schema.Types.ObjectId // employee id
  },
  {
    versionKey: false, // remove field "__v"
  }
)

module.exports = model('Customers', CustomerSchema)
