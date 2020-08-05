const express = require("express")
const router = express.Router()
const RoomLetter = require("../../models/room-letter.model")
const Room = require("../../models/room.model")
const RoomCategory = require("../../models/room-category.model")
const Customer = require("../../models/customer.model")
const Surcharge = require("../../models/surcharge.model")
const CustomerType = require("../../models/customer-type.model")
User = require("../../models/user.model")

router.get("/views", async (req, res) => {
  try {
    let _roomletters = await RoomLetter.find({ isDeleted: false })
    const _rooms = await Room.find({ isDeleted: false })
    const _customers = await Customer.find({ isDeleted: false })
    const _customerTypes = await CustomerType.find({ isDeleted: false })
    if (_roomletters && _roomletters.length > 0) {
      for (let i = 0; i < _roomletters.length; i++) {
        const createdByUser = await User.findById(_roomletters[i].createdBy)
        _roomletters[i].createdByUser = createdByUser ? createdByUser.name : ""

        const cus = await Customer.findById(_roomletters[i].customerId)
        _roomletters[i].cus = cus ? cus.name : ""

        const room = await Room.findById(_roomletters[i].roomId)
        _roomletters[i].room = room ? room.nameOfRoom : ""
      }
    }

    res.render("pages/room-letters/index", {
      layout: "layout",
      data: _roomletters,
      dataRoom: _rooms,
      dataType: _customerTypes || [],
      dataCustomer: _customers,
      curUser: req.curUser,
      pageTitle: 'Phiếu thuê phòng'
    })
  } catch (error) {
    console.log(error)
  }
})

router.post("/add", async (req, res) => {
  try {
    const { customerId, roomId, dayCheckIn, dayCheckOut, numberOfPeople, customerTypeId } = req.body;
    const sur = Surcharge.findOne({isEnabled: true}) // Surcharge chua lay dc data, xem lai!!!!!
    const room = await Room.findById(roomId);

    const _roomletter = new RoomLetter({})
    _roomletter.customerId = customerId
    _roomletter.roomId = roomId
    _roomletter.dayCheckIn = Date.parse(dayCheckIn)
    _roomletter.dayCheckOut = Date.parse(dayCheckOut)
    // NumberOfDays
    const diffTime = Math.abs(Date.parse(dayCheckOut) - Date.parse(dayCheckIn));
    _roomletter.numberOfDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    _roomletter.numberOfPeople = numberOfPeople
    _roomletter.surchargeId = sur._id
    _roomletter.customerTypeId = customerTypeId
    _roomletter.hasPayed = false
    _roomletter.createdBy = req.curUser._id
    // Price
    let priceRoom = room.price;
    if (!priceRoom) {
      const cateData = await RoomCategory.findById(room.cateOfRoomId);
      priceRoom = cateData.price;
      console.log("Vo if dau tien");

    } else {
      if (numberOfPeople >= sur.numberOfPeople) {
        _roomletter.price = priceRoom + sur.surchargePercent * priceRoom / 100;
      } else {
        _roomletter.price = priceRoom;
      }
    }

    await _roomletter.save()
    return res.redirect("/room-letters/views")
  } catch (error) {
    console.log(error)
    res.render(error)
  }
})

router.post("/update", async (req, res) => {
  try {
    const { id, customerId, roomId, dayCheckIn, dayCheckOut, numberOfPeople, customerTypeId } = req.body
    const sur = Surcharge.findOne({isEnabled: true}) // Surcharge chua lay dc data, xem lai!!!!!
    const room = await Room.findById(roomId);
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
      const diffTime = Math.abs(Date.parse(dayCheckOut) - Date.parse(dayCheckIn));
      _roomletter.numberOfDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (numberOfPeople) _roomletter.numberOfPeople = numberOfPeople
      if (customerTypeId) _roomletter.customerTypeId = customerTypeId
      _roomletter.surchargeId = sur._id
      // Price
      let priceRoom = room.price;
      if (!priceRoom) {
        const cateData = await RoomCategory.findById(room.cateOfRoomId);
        priceRoom = cateData.price;
        console.log("Vo if dau tien");

      } else {
        if (numberOfPeople >= sur.numberOfPeople) {
          _roomletter.price = priceRoom + sur.surchargePercent * priceRoom / 100;
        } else {
          _roomletter.price = priceRoom;
        }
      }
      
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
      await _roomletter.save()
    }
    return res.redirect("/room-letters/views")
  } catch (error) {
    console.log(error)
    res.render(error)
  }
})

module.exports = router
