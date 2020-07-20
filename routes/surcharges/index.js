const express = require("express")
const router = express.Router()
const Surcharge = require("../../models/surcharge.model")
const User = require("../../models/user.model")

router.get("/views", async (req, res) => {
  try {
    let _surcharges = await Surcharge.find({ isDeleted: false })
    if (_surcharges && _surcharges.length > 0) {
      for (let i = 0; i < _surcharges.length; i++) {
        const createdByUser = await User.findById(_surcharges[i].createdBy)
        _surcharges[i].createdByUser = createdByUser ? createdByUser.name : ""
      }
    }
    res.render("pages/surcharges/index", {
      layout: "layout",
      data: _surcharges || [],
      curUser: req.curUser
    })
  } catch (error) {
    console.log(error)
  }
})

router.post("/add", async (req, res) => {
  try {
    const createdBy = "5f02c588e88cb9194897288d" // id employee or admin
    const { numberOfPeople, surchargePercent } = req.body
    const _surcharge = new Surcharge({})
    _surcharge.numberOfPeople = parseInt(numberOfPeople)
    _surcharge.surchargePercent = parseInt(surchargePercent)
    _surcharge.createdBy = createdBy
    await _surcharge.save()
    return res.redirect("/surcharges/views")
  } catch (error) {
    console.log(error)
    res.render(error)
  }
})

router.post("/update", async (req, res) => {
  try {
    const { id, numberOfPeople, surchargePercent } = req.body
    if (!id) {
      console.log("id not found")
      return
    }
    const _surcharge = await Surcharge.findById(id)
    if (_surcharge) {
      if (numberOfPeople) _surcharge.numberOfPeople = numberOfPeople
      if (surchargePercent) _surcharge.surchargePercent = surchargePercent
      await _surcharge.save()
    }
    return res.redirect("/surcharges/views")
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
    return res.redirect("/surcharges/views")
  } catch (error) {
    console.log(error)
    res.render(error)
  }
})

module.exports = router
