const express = require("express")
const router = express.Router()
const RoomCategory = require("../../models/room-category.model")
const Room = require("../../models/room.model")
const User = require("../../models/user.model")
const Customer = require("../../models/customer.model")
const RoomLetter = require("../../models/room-letter.model")
const Order = require("../../models/order.model")


router.get("/views", async (req, res) => {
  try {
    let _roomCategories = await RoomCategory.find({ isDeleted: false })
    const _rooms = await Room.find({ isDeleted: false })
    const _employees = await User.find({ isDeleted: false, isEnabled: true })
    const _customers = await Customer.find({ isDeleted: false })
    const _roomLetters = await RoomLetter.find({ isDeleted: false, hasPayed: true })
    const _orders = await Order.find({ isDeleted: false, hasPayed: true })

    const ts_now = new Date()
    let first_day_month = new Date(ts_now.getFullYear(), ts_now.getMonth(), 1).getTime();
    let last_day_month = new Date(ts_now.getFullYear(), ts_now.getMonth() + 1, 1).getTime();
    let _numRoomletters = [];
    let _totalPrices = [];
    for (let i = 0; i < _roomCategories.length; i++){
      let numRoomLetter = 0; let price = 0;
      let roomWithCateId = await Room.find({ isDeleted: false, cateOfRoomId: _roomCategories[i]._id })
      for (let j = 0; j < roomWithCateId.length; j++) {
        let roomLetterWithRoomId = await RoomLetter.find
        ({ 
          isDeleted: false, 
          hasPayed: true, 
          roomId: roomWithCateId[j]._id, 
          createdAt: {
          $gte: first_day_month,
          $lt: last_day_month,
          }, 
        })
        numRoomLetter += roomLetterWithRoomId.length;
        for (let k = 0; k < roomLetterWithRoomId.length; k++){
          price += roomLetterWithRoomId[k].price;
        }
      }
      _numRoomletters.push(numRoomLetter);
      _totalPrices.push(price);
    }

    for (let i = 0; i < _roomCategories.length; i++){
      _roomCategories[i].nameCate = _roomCategories ? _roomCategories[i].nameOfCategory : "";
      _roomCategories[i].numRoomLetter = _numRoomletters[i];
      _roomCategories[i].price = _totalPrices[i];
    }

    let totalMoney = 0;
    for (let i = 0; i < _totalPrices.length; i++){
      totalMoney += _totalPrices[i];
    }

    res.render("pages/reports/index", {
      layout: "layout",
      // data: _roomCategories || [],
      numRoom: _rooms.length || 0,
      numEmployee: _employees.length || 0,
      numRoomCate: _roomCategories.length || 0,
      numCus: _customers.length || 0,
      numRoomLetter: _roomLetters.length || 0,
      numOrder: _orders.length || 0,
      data: _roomCategories,
      totalMoney: totalMoney,
      curUser: req.curUser,
      pageTitle: 'Báo cáo doanh thu'
    })
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
