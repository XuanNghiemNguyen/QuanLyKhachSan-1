const express = require("express")
const router = express.Router()
const Customer = require("../../models/customer.model")
const CustomerType = require("../../models/customer-type.model")
const { notification } = require("../../common/index")

const get_notify = (type) => {
  switch (type) {
    case "create":
      return notification(true, "Thông báo", "Tạo khách hàng thành công!")
    case "update":
      return notification(true, "Thông báo", "Cập nhật thông tin khách hàng thành công!")
    case "delete":
      return notification(true, "Thông báo", "Xóa khách hàng thành công!")
    default:
      break
  }
}

router.get("/views", async (req, res) => {
  try {
    const _customers = await Customer.find({ isDeleted: false })
    const _customerTypes = await CustomerType.find({ isDeleted: false })

    if (_customers && _customers.length > 0) {
      for (let i = 0; i < _customers.length; i++) {
        const type = await CustomerType.findById(_customers[i].customerTypeId)
        _customers[i].type = type ? type.nameOfType : ""
      }
    }

    const { success, type } = req.query
    let notify = {}
    if (success && type) {
      notify = get_notify(type)
    }

    res.render("pages/customers/index", {
      layout: "layout",
      data: _customers,
      dataType: _customerTypes || [],
      curUser: req.curUser,
      pageTitle: "Khách hàng",
      notification: notify
    })
  } catch (error) {
    console.log(error)
  }
})

router.post("/add", async (req, res) => {
  try {
    const createdBy = req.curUser._id // id employee or admin
    const { name, numberOfId, customerTypeId, address, gender } = req.body
    const _customer = new Customer({})
    _customer.name = name
    _customer.numberOfId = numberOfId
    _customer.customerTypeId = customerTypeId
    _customer.address = address
    _customer.gender = gender
    _customer.createdBy = createdBy
    await _customer.save()
    return res.redirect("/customers/views?success=true&type=create")
  } catch (error) {
    console.log(error)
    res.render(error)
  }
})

router.post("/update", async (req, res) => {
  try {
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
    return res.redirect("/customers/views?success=true&type=update")
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
    const _customer = await Customer.findById(id)
    if (_customer) {
      _customer.isDeleted = true
      await _customer.save()
    }
    return res.redirect("/customers/views?success=true&type=delete")
  } catch (error) {
    console.log(error)
    res.render(error)
  }
})

module.exports = router
