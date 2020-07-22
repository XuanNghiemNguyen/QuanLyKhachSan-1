const { Schema, model } = require('mongoose')

const OrderSchema = new Schema(
  {
    roomLetterIds: [Schema.Types.ObjectId],
    employeeId: Schema.Types.ObjectId,
    totalPrice: { type: Number, min: 10000 },
    isDeleted: { type: Boolean, default: false },
    isPaid: { type: Boolean, default: false },
    createdAt: { type: Number, default: Date.now() },
  },
  {
    versionKey: false, // remove field "__v"
  }
)

module.exports = model('Orders', OrderSchema)
