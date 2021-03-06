const express = require("express")
const router = express.Router()
const Surcharge = require("../../models/surcharge.model")
const User = require("../../models/user.model")
const { notification } = require("../../common")

const get_notify = (type) => {
  switch (type) {
    case "create":
      return notification(true, "Thông báo", "Tạo phụ phí phòng thành công!")
    case "update":
      return notification(true, "Thông báo", "Cập nhật phụ phí thành công!")
    case "delete":
      return notification(true, "Thông báo", "Xóa phụ phí phòng thành công!")
    default:
      break
  }
}

router.get("/views", async (req, res) => {
  try {
    let _surcharges = await Surcharge.find({ isDeleted: false })
    if (_surcharges && _surcharges.length > 0) {
      for (let i = 0; i < _surcharges.length; i++) {
        const createdByUser = await User.findById(_surcharges[i].createdBy)
        _surcharges[i].createdByUser = createdByUser ? createdByUser.name : ""
      }
    }

    const { success, type } = req.query
    let notify = {}
    if (success && type) {
      notify = get_notify(type)
    }

    res.render("pages/surcharges/index", {
      layout: "layout",
      data: _surcharges || [],
      curUser: req.curUser,
      pageTitle: "Phụ phí",
      notification: notify,
    })
  } catch (error) {
    console.log(error)
  }
})

router.post("/add", async (req, res) => {
  try {
    const createdBy = req.curUser._id // id employee or admin
    const { numberOfPeople, surchargePercent, isEnabled } = req.body
    const _surcharge = new Surcharge({})
    _surcharge.numberOfPeople = parseInt(numberOfPeople)
    _surcharge.surchargePercent = parseInt(surchargePercent)
    _surcharge.isEnabled = isEnabled
    _surcharge.createdBy = createdBy
    await _surcharge.save()
    return res.redirect("/surcharges/views?success=true&type=create")
  } catch (error) {
    console.log(error)
    res.render(error)
  }
})

router.post("/update", async (req, res) => {
  try {
    const { id, numberOfPeople, surchargePercent, isEnabled } = req.body
    if (!id) {
      console.log("id not found")
      return
    }
    const _surcharge = await Surcharge.findById(id)
    if (_surcharge) {
      if (numberOfPeople) _surcharge.numberOfPeople = numberOfPeople
      if (surchargePercent) _surcharge.surchargePercent = surchargePercent
      if (isEnabled) _surcharge.isEnabled = isEnabled
      await _surcharge.save()
    }
    return res.redirect("/surcharges/views?success=true&type=update")
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
    const _surcharge = await Surcharge.findById(id)
    if (_surcharge) {
      _surcharge.isDeleted = true
      await _surcharge.save()
    }
    return res.redirect("/surcharges/views?success=true&type=delete")
  } catch (error) {
    console.log(error)
    res.render(error)
  }
})

module.exports = router
