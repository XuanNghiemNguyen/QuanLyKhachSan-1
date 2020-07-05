const { Schema, model } = require('mongoose')

const SurchargeSchema = new Schema(
  {
    numberOfPeople: { type: Number, default: 3 }, // từ numberOfPeople người trở lên thì chiụ phí
    surchargePercent:  { type: Number, default: 25, min: 0, max: 100 },
  },
  {
    versionKey: false, // remove field "__v"
  }
)

module.exports = model('Surcharges', SurchargeSchema)
ừ
