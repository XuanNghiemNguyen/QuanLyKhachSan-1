const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const Users = require("../../models/user.model")
router.post("/add", async (req, res) => {
  try {
      const { name, password, email } = req.body
      const _user = new Users()
      const hash = bcrypt.hashSync(password, 10)
      _user.name = name
      _user.password = hash
      _user.email = email
      _user.address = address || ""
      await _user.save()
      return res.json({
        success: true,
        user: _user,
      })
  } catch (error) {
    console.log(error)
    return res.json({
      success: true,
      error,
    })
  }
})
router.get("check-email", async (req, res) => {
  try {
    const { email } = req.query
    if (!email)
      return res.status(400).json({
        success: false,
        error: "email is required!",
      })
    const _userExisted = await Users.findOne({ email })
    return res.json({
      success: true,
      existed: _userExisted ? true : false,
    })
  } catch (error) {
    console.log(error)
    return res.json({
      success: true,
      error,
    })
  }
})
module.exports = router
