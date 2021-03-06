const { Schema, model } = require('mongoose')
const { Decimal128 } = require('mongodb')

const CustomerTypeSchema = new Schema(
  {
    nameOfType: {
      type: String,
      uppercase: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    factor: { type: Number, default: 1.5 },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Number, default: Date.now() },
    createdBy: Schema.Types.ObjectId, // employee id
  },
  {
    versionKey: false, // remove field "__v"
  }
)

module.exports = model('CustomerTypes', CustomerTypeSchema)
