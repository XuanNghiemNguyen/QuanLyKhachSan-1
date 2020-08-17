const express = require("express")
const router = express.Router()
const RoomLetter = require("../../models/room-letter.model")
const Room = require("../../models/room.model")
const RoomCategory = require("../../models/room-category.model")
const Customer = require("../../models/customer.model")
const Surcharge = require("../../models/surcharge.model")
const CustomerType = require("../../models/customer-type.model")
const User = require("../../models/user.model")
const { notification } = require("../../common")

router.get("/views", async (req, res) => {
  try {
    let _roomletters = await RoomLetter.find({ isDeleted: false })
    const _rooms = await Room.find({ isDeleted: false, status: "Còn trống" })
    const _customers = await Customer.find({ isDeleted: false })
    const _customerTypes = await CustomerType.find({ isDeleted: false })
    if (_roomletters && _roomletters.length > 0) {
      for (let i = 0; i < _roomletters.length; i++) {
        const createdByUser = await User.findById(_roomletters[i].createdBy)
        _roomletters[i].createdByUser = createdByUser ? createdByUser.name : ""

        const cus = await Customer.findById(_roomletters[i].customerId)
        _roomletters[i].cus = cus ? cus.name : ""

        const cusType = await CustomerType.findById(
          _roomletters[i].customerTypeId
        )
        _roomletters[i].cusType = cusType ? cusType.nameOfType : ""

        const room = await Room.findById(_roomletters[i].roomId)
        _roomletters[i].room = room ? room.nameOfRoom : ""

        // Get data for printing
        const category = await RoomCategory.findById(room.cateOfRoomId)
        _roomletters[i].category = category ? category.nameOfCategory : ""

        const surcharge = await Surcharge.findById(_roomletters[i].surchargeId)
        _roomletters[i].surcharge = surcharge ? surcharge.surchargePercent : "0"
      }
    }

    res.render("pages/room-letters/index", {
      layout: "layout",
      data: _roomletters,
      dataRoom: _rooms,
      dataType: _customerTypes || [],
      dataCustomer: _customers,
      curUser: req.curUser,
      pageTitle: "Phiếu thuê phòng",
      notification: notification(false),
    })
  } catch (error) {
    console.log(error)
  }
})

router.post("/add", async (req, res) => {
  try {
    const {
      customerId,
      roomId,
      dayCheckIn,
      dayCheckOut,
      numberOfPeople,
      customerTypeId,
    } = req.body
    const sur = await Surcharge.find({ isEnabled: true }) // Surcharge chua lay dc data, xem lai!!!!!
    const room = await Room.findById(roomId)
    let _roomletter = new RoomLetter()
    if (customerId) _roomletter.customerId = customerId
    if (roomId) _roomletter.roomId = roomId
    if (dayCheckIn) _roomletter.dayCheckIn = Date.parse(dayCheckIn)
    if (dayCheckOut) _roomletter.dayCheckOut = Date.parse(dayCheckOut)
    // NumberOfDays
    const diffTime = Math.abs(Date.parse(dayCheckOut) - Date.parse(dayCheckIn))
    let numDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    _roomletter.numberOfDays = numDay
    if (numberOfPeople) _roomletter.numberOfPeople = numberOfPeople
    //price of unit
    let priceRoom = room && room.price
    if (!priceRoom) {
      const cateData = await RoomCategory.findById(room.cateOfRoomId)
      priceRoom = cateData.price || 0
    }
    if (customerTypeId) {
      _roomletter.customerTypeId = customerTypeId
      //price is changed by customerType
      const _customerTypes = await CustomerType.findById(customerTypeId)
      if (_customerTypes) {
        priceRoom *= _customerTypes.factor || 1
      }
    }
    if (sur && sur[0]._id) {
      _roomletter.surchargeId = sur[0]._id
      //price is changed by surcharge
      if (numberOfPeople >= sur[0].numberOfPeople) {
        priceRoom += (sur[0].surchargePercent * priceRoom) / 100
      }
    }
    _roomletter.price = priceRoom * parseInt(numberOfPeople)
    _roomletter.createdBy = req.curUser._id
    room.status = "Đang sử dụng"
    await room.save()
    await _roomletter.save()
    return res.redirect("/room-letters/views")
  } catch (error) {
    console.log(error)
    res.render(error)
  }
})

router.post("/update", async (req, res) => {
  try {
    const {
      id,
      customerId,
      roomId,
      dayCheckIn,
      dayCheckOut,
      numberOfPeople,
      customerTypeId,
    } = req.body
    const sur = await Surcharge.find({ isEnabled: true }) // Surcharge chua lay dc data, xem lai!!!!!
    const room = await Room.findById(roomId)
    if (!id) {
      return
    }
    const _roomletter = await RoomLetter.findById(id)
    if (_roomletter) {
      if (customerId) _roomletter.customerId = customerId
      if (roomId) _roomletter.roomId = roomId
      if (dayCheckIn) _roomletter.dayCheckIn = Date.parse(dayCheckIn)
      if (dayCheckOut) _roomletter.dayCheckOut = Date.parse(dayCheckOut)
      // NumberOfDays
      const diffTime = Math.abs(
        Date.parse(dayCheckOut) - Date.parse(dayCheckIn)
      )
      _roomletter.numberOfDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      if (numberOfPeople) _roomletter.numberOfPeople = numberOfPeople
      //price of unit
      let priceRoom = room && room.price
      if (!priceRoom) {
        const cateData = await RoomCategory.findById(room.cateOfRoomId)
        priceRoom = cateData.price || 0
      }
      if (customerTypeId) {
        _roomletter.customerTypeId = customerTypeId
        //price is changed by customerType
        const _customerTypes = await CustomerType.findById(customerTypeId)
        if (_customerTypes) {
          priceRoom *= _customerTypes.factor || 1
        }
      }
      if (sur && sur[0]._id) {
        _roomletter.surchargeId = sur[0]._id
        //price is changed by surcharge
        if (numberOfPeople >= sur[0].numberOfPeople) {
          priceRoom += (sur[0].surchargePercent * priceRoom) / 100
        }
      }
      _roomletter.price = priceRoom * parseInt(numberOfPeople) * numDay
      _roomletter.createdBy = req.curUser._id
      await _roomletter.save()
    }
    return res.redirect("/room-letters/views")
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
    const _roomletter = await RoomLetter.findById(id)
    if (_roomletter) {
      _roomletter.isDeleted = true
      const room = Room.findById(_roomletter.roomId)
      if (room) {
        room.status = "Còn trống"
        await room.save()
      }
      await _roomletter.save()
    }
    return res.redirect("/room-letters/views")
  } catch (error) {
    console.log(error)
    res.render(error)
  }
})

module.exports = router
