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
    factor: { type: Number, default: 1.5 }, //Hệ số của khách
    createdAt: { type: Number, default: Date.now() },
    createdBy: Schema.Types.ObjectId, // employee id
  },
  {
    versionKey: false, // remove field "__v"
  }
)

module.exports = model('RoomCategories', RoomCategorySchema)
