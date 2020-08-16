const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const User = require("../../models/user.model")
const { notification } = require("../../common/index")
router.get("/views", async (req, res) => {
  try {
    let _users = await User.find({ isDeleted: false, type: "employee" })
    if (_users && _users.length > 0) {
      for (let i = 0; i < _users.length; i++) {
        const createdByUser = await User.findById(_users[i].createdBy)
        _users[i].createdByUser = createdByUser ? createdByUser.name : ""
      }
    }
    return res.render("pages/employees/index", {
      layout: "layout",
      data: _users || [],
      curUser: req.curUser,
      pageTitle: "Nhân viên",
      notification: notification(false),
    })
  } catch (error) {
    console.log(error)
  }
})

router.post("/add", async (req, res) => {
  try {
    const createdBy = req.curUser._id // id employee or admin
    const { name, email, password, address, avatar, isEnabled } = req.body
    const _user = new User({})
    _user.name = name
    _user.email = email
    const hash = bcrypt.hashSync(password, 10)
    _user.password = hash
    _user.address = address
    _user.avatar = avatar
    _user.isEnabled = isEnabled
    _user.createdBy = createdBy
    await _user.save()
    return res.redirect("/employees/views")
  } catch (error) {
    console.log(error)
    res.render(error)
  }
})

router.post("/update", async (req, res) => {
  try {
    const { id, name, email, password, address, avatar, isEnabled } = req.body
    if (!id) {
      return
    }
    const _user = await User.findById(id)
    if (_user) {
      if (name) _user.name = name
      if (email) _user.email = email
      if (password) {
        const hash = bcrypt.hashSync(password, 10)
        _user.password = hash
      }
      if (address) _user.address = address
      if (avatar) _user.avatar = avatar
      if (isEnabled) _user.isEnabled = isEnabled
      await _user.save()
    }
    return res.redirect("/employees/views")
  } catch (error) {
    console.log(error)
    res.render(error)
  }
})

router.post("/delete", async (req, res) => {
  try {
    const { id } = req.body
    if (!id) {
      console.log("id not found")
      return
    }
    const _user = await User.findById(id)
    if (_user) _user.isDeleted = true
    await _user.save()
    return res.redirect("/employees/views")
  } catch (error) {
    console.log(error)
    res.render(error)
  }
})

module.exports = router
