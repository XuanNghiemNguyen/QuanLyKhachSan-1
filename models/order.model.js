const { Schema, model } = require('mongoose')

const OrderSchema = new Schema(
  {
    roomLetterIds: { type: [String], default: [] },
    customerId: Schema.Types.ObjectId,
    employeeId: Schema.Types.ObjectId,
    totalPrice: { type: Number },
    hasPayed: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Number, default: Date.now() },
  },
  {
    versionKey: false, // remove field "__v"
  }
)

module.exports = model('Orders', OrderSchema)
