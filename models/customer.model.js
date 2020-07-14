const { Schema, model } = require('mongoose')

const CustomerSchema = new Schema(
  {
    numberOfId: String,
    name: {
      type: String,
      uppercase: true,
      trim: true,
      minlength: 1,
      maxlength: 40,
    },
    gender: { type: String, default: 'Nam' },
    address: String,
    customerTypeId: Schema.Types.ObjectId,
    employeeId: Schema.Types.ObjectId, // chua dung
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Number, default: Date.now() },
    createdBy: Schema.Types.ObjectId // employee id
  },
  {
    versionKey: false, // remove field "__v"
  }
)

module.exports = model('Customers', CustomerSchema)
