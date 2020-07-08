const { Schema, model } = require('mongoose')

const RoomCategorySchema = new Schema(
  {
    nameOfCategory: {
      type: String,
      uppercase: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    price: { type: Number, default: 150000, min: 10000 },
    note: { type: String, default: '' },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Number, default: Date.now() },
    createdBy: Schema.Types.ObjectId, // employee id
  },
  {
    versionKey: false, // remove field "__v"
  }
)

module.exports = model('RoomCategories', RoomCategorySchema)
