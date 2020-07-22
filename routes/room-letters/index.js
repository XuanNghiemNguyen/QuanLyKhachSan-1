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
    // const _customers = await Customer.find({ isDeleted: false })
    const _customerTypes = await CustomerType.find({ isDeleted: false })
    if (_roomletters && _roomletters.length > 0) {
      for (let i = 0; i < _roomletters.length; i++) {
        const createdByUser = await User.findById(_roomletters[i].createdBy)
        _roomletters[i].createdByUser = createdByUser
          ? createdByUser.name
          : ""
          // _roomletters[i].dayCheckIn = (new Date(_roomletters[i].dayCheckIn)).toLocaleDateString().split('/').reverse().join('-');
          // _roomletters[i].dayCheckOut = (new Date(_roomletters[i].dayCheckOut)).toLocaleDateString().split('/').reverse().join('-');
          console.log(i);
      }
    }
    console.log(_roomletters[1])

    res.render("pages/room-letters/index", {
      layout: "layout",
      data: _roomletters,
      // data: _customers,
      dataType: _customerTypes || [],
      curUser: req.curUser
    })
  } catch (error) {
    console.log(error)
  }
})

router.post("/add", async (req, res) => {
  try {
    const sur = Surcharge.findOne({isEnabled: true})
    const createdBy = "5f02c588e88cb9194897288d" // id employee or admin
    const { customerId, roomId, dayCheckIn, dayCheckOut, numberOfDays, numberOfPeople, surchargeId, customerTypeId } = req.body;
    const room = await Room.findById(roomId);
    let priceRoom = room.price;
    if (!priceRoom) {
      const cateData = await RoomCategory.findById(room.cateOfRoomId);
      priceRoom = cateData.price;
    }
    const _roomletter = new RoomLetter({})
    _roomletter.customerId = customerId
    _roomletter.roomId = roomId
    // _roomletter.dayCheckIn = dayCheckIn
    _roomletter.dayCheckIn = Date.parse(dayCheckIn)
    _roomletter.dayCheckOut = Date.parse(dayCheckOut)
    const diffTime = Math.abs(Date.parse(dayCheckOut) - Date.parse(dayCheckIn));
    _roomletter.numberOfDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    _roomletter.numberOfPeople = numberOfPeople
    _roomletter.surchargeId = sur._id
    _roomletter.customerTypeId = customerTypeId
    _roomletter.createdBy = createdBy
    if (numberOfPeople > sur.numberOfPeople) {
        _roomletter.price = priceRoom + sur.surchargePercent * priceRoom / 100;
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
    const { id, customerId, roomId, dayCheckIn, dayCheckOut, numberOfDays, numberOfPeople, surchargeId, customerTypeId } = req.body
    if (!id) {
      return
    }
    const _roomletter = await RoomLetter.findById(id)
    if (_roomletter) {
      if (customerId) _roomletter.customerId = customerId
      if (roomId) _roomletter.roomId = roomId
      if (dayCheckIn) _roomletter.dayCheckIn = Date.parse(dayCheckIn)
      if (dayCheckOut) _roomletter.dayCheckOut = Date.parse(dayCheckOut)
      if (numberOfDays) _roomletter.numberOfDays = numberOfDays
      if (numberOfPeople) _roomletter.numberOfPeople = numberOfPeople
      if (surchargeId) _roomletter.surchargeId = surchargeId
      if (customerTypeId) _roomletter.customerTypeId = customerTypeId
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
