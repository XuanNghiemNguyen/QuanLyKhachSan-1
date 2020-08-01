const { Schema, model } = require('mongoose')

const RoomLetterSchema = new Schema(
  {
    customerId: Schema.Types.ObjectId,
    roomId: Schema.Types.ObjectId,
    dayCheckIn: { type: Number, default: Date.now() }, //------
    dayCheckOut: { type: Number, default: Date.now() }, //------
    numberOfDays: { type: Number, default: 1 }, //------
    numberOfPeople: { type: Number, min: 0, default: 2 },
    surchargeId: Schema.Types.ObjectId, // Tỷ lệ phụ thu //------
    customerTypeId: Schema.Types.ObjectId, // Tham chiếu tới customerType
    price: {type: Number},
    hasPayed: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Number, default: Date.now() },
    createdBy: Schema.Types.ObjectId, // employee id
  },
  {
    versionKey: false, // remove field "__v"
  }
)

module.exports = model('RoomLetters', RoomLetterSchema)
