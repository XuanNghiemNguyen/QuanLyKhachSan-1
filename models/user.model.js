const { Schema, model } = require("mongoose")

const UserSchema = new Schema(
  {
    type: { type: String, maxlength: 10, default: "employee" }, // or admin
    name: { type: String, maxlength: 50, required: true },
    password: { type: String, maxlength: 255, required: true },
    email: { type: String, maxlength: 50, required: true, unique: true },
    address: { type: String, maxlength: 255, default: "TPHCM" },
    avatar: {
      type: String,
      maxlength: 255,
      default:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/768px-User_icon_2.svg.png",
    },
    isEnabled: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Number, default: +new Date() },
    createdBy: { type: String, required: true },
  },
  {
    versionKey: false, // remove field "__v"
  }
)

module.exports = model("Users", UserSchema)
