const { Schema, model } = require('mongoose')

const RoomSchema = new Schema(
  {
    nameOfRoom: {
      type: String,
      uppercase: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    cateOfRoomId: Schema.Types.ObjectId,
    price: { type: Number, min: 10000 },
    status: { type: String, default: 'Còn trống' }, // "Còn trống", "Đang sử dụng" // Xem lai: Nen la enum, khong nen cho nguoi dung nhap string
    note: { type: String, default: '' },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Number, default: Date.now() },
    createdBy: Schema.Types.ObjectId, // employee id
    maxPeople: { type: Number, min: 1, default: 3 }
  },
  {
    versionKey: false, // remove field "__v"
  }
)

module.exports = model('Rooms', RoomSchema)
