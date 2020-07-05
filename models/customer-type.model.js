const { Schema, model } = require('mongoose')

const CustomerTypeSchema = new Schema(
  {
    nameOfType: {
      type: String,
      uppercase: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    factor: { type: Number, default: 1.5 },
    createdAt: { type: Number, default: Date.now() },
    createdBy: Schema.Types.ObjectId, // employee id
  },
  {
    versionKey: false, // remove field "__v"
  }
)

module.exports = model('CustomerTypes', CustomerTypeSchema)
