const express = require("express")
const router = express.Router()
const User = require("../../models/user.model")

router.get("/views", async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      let _users = await User.find({ isDeleted: false })
      if (_users && _users.length > 0) {
        for (let i = 0; i < _users.length; i++) {
          const createdByUser = await User.findById(
            _users[i].createdBy
          )
          _users[i].createdByUser = createdByUser
            ? createdByUser.name
            : ""
        }
      }
      res.render("pages/employees/index", {
        layout: "layout",
        data: _users || [],
      })
    } else {
      return res.redirect("/login")
    }
  } catch (error) {
    console.log(error)
  }
})

router.post("/add", async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      const createdBy = "5f02c588e88cb9194897288d" // id employee or admin
      const { type, name, email, password, address, avatar, isEnabled } = req.body
      const _user = new User({})
      _user.type = type
      _user.name = name
      _user.email = email
      _user.password = password
      _user.address = address
      _user.avatar = avatar
      _user.isEnabled = isEnabled
      _user.createdBy = createdBy
      await _user.save()
      return res.redirect("/employees/views")
    } else {
      return res.redirect("/login")
    }
  } catch (error) {
    console.log(error)
    res.render(error)
  }
})

router.post("/update", async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      const { id, type, name, email, password, address, avatar, isEnabled } = req.body
      if (!id) {
        return
      }
      const _user = await User.findById(id)
      if (_user) {
        if (type) _user.type = type
        if (name) _user.name = name
        if (email) _user.email = email
        if (password) _user.password = password
        if (address) _user.address = address
        if (avatar) _user.avatar = avatar
        if (isEnabled) _user.isEnabled = isEnabled
        await _user.save()
      }
      return res.redirect("/employees/views")
    } else {
      return res.redirect("/login")
    }
  } catch (error) {
    console.log(error)
    res.render(error)
  }
})

router.post("/delete", async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      const { id } = req.body
      if (!id) {
        console.log('id not found')
        return
      }
      const _user = await User.findById(id)
      console.log("nghiem", _user)
      if (_user) _user.isDeleted = true
      await _user.save()
      return res.redirect("/employees/views")
    } else {
      return res.redirect("/login")
    }
  } catch (error) {
    console.log(error)
    res.render(error)
  }
})

module.exports = router