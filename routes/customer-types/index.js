const express = require("express")
const router = express.Router()
const CustomerType = require("../../models/customer-type.model")
const User = require("../../models/user.model")

router.get("/views", async (req, res) => {
  try {
    let _customerTypes = await CustomerType.find({ isDeleted: false })
    if (_customerTypes && _customerTypes.length > 0) {
      for (let i = 0; i < _customerTypes.length; i++) {
        const createdByUser = await User.findById(_customerTypes[i].createdBy)
        _customerTypes[i].createdByUser = createdByUser
          ? createdByUser.name
          : ""
      }
    }
    res.render("pages/customer-types/index", {
      layout: "layout",
      data: _customerTypes || [],
      curUser: req.curUser
    })
  } catch (error) {
    console.log(error)
  }
})

router.post("/add", async (req, res) => {
  try {
    const createdBy = req.curUser._id // id employee or admin
    const { nameOfType, factor } = req.body
    const _customerType = new CustomerType({})
    _customerType.nameOfType = nameOfType
    _customerType.factor = parseFloat(factor)
    _customerType.createdBy = createdBy
    await _customerType.save()
    return res.redirect("/customer-types/views")
  } catch (error) {
    console.log(error)
    res.render(error)
  }
})

router.post("/update", async (req, res) => {
  try {
    const { id, nameOfType, factor } = req.body
    if (!id) {
      return
    }
    const _customerType = await CustomerType.findById(id)
    if (_customerType) {
      if (nameOfType) _customerType.nameOfType = nameOfType
      if (factor) _customerType.factor = factor
      await _customerType.save()
    }
    return res.redirect("/customer-types/views")
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
    const _customerType = await CustomerType.findById(id)
    console.log("nghiem", _customerType)
    if (_customerType) {
      _customerType.isDeleted = true
      await _customerType.save()
    }
    return res.redirect("/customer-types/views")
  } catch (error) {
    console.log(error)
    res.render(error)
  }
})

module.exports = router
