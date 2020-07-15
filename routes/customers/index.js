const express = require("express")
const router = express.Router()
const Customer = require("../../models/customer.model")
const CustomerType = require("../../models/customer-type.model")

router.get("/views", async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      const _customers = await Customer.find({ isDeleted: false })
      const _customerTypes = await CustomerType.find({ isDeleted: false })

      if (_customers && _customers.length > 0) {
        for (let i = 0; i < _customers.length; i++) {
          const type = await CustomerType.findById(_customers[i].customerTypeId)
          _customers[i].type = type ? type.nameOfType : ""
        }
      }
      res.render("pages/customers/index", {
        layout: "layout",
        data: _customers,
        dataType: _customerTypes || [],
      })
    } else {
      res.redirect("/login")
    }
  } catch (error) {
    console.log(error)
  }
})

router.post("/add", async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      const createdBy = "5f02c588e88cb9194897288d" // id employee or admin
      const { name, numberOfId, customerTypeId, address, gender } = req.body
      const _customer = new Customer({})
      _customer.name = name
      _customer.numberOfId = numberOfId
      _customer.customerTypeId = customerTypeId
      _customer.address = address
      _customer.gender = gender
      _customer.createdBy = createdBy
      await _customer.save()
      return res.redirect("/customers/views")
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
      const { id, name, numberOfId, customerTypeId, address, gender } = req.body
      if (!id) {
        return
      }
      const _customer = await Customer.findById(id)
      if (_customer) {
        if (name) _customer.name = name
        if (numberOfId) _customer.numberOfId = numberOfId
        if (customerTypeId) _customer.customerTypeId = customerTypeId
        if (gender) _customer.gender = gender
        if (address) _customer.address = address
        await _customer.save()
      }
      return res.redirect("/customers/views")
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
        console.log("id not found")
        return
      }
      const _customer = await Customer.findById(id)
      if (_customer) {
        _customer.isDeleted = true
        await _customer.save()
      }
      return res.redirect("/customers/views")
    } else {
      return res.redirect("/login")
    }
  } catch (error) {
    console.log(error)
    res.render(error)
  }
})

module.exports = router
