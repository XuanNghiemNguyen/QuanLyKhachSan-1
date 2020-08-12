const express = require("express")
const router = express.Router()
const Room = require("../../models/room.model")
const RoomCategory = require("../../models/room-category.model")
const RoomLetter = require("../../models/room-letter.model")
const Order = require("../../models/order.model")

router.get("/", async (req, res) => {
  try {
    const _freeRooms = await Room.find({
      status: "Còn trống",
      isDeleted: false,
    })
    const ts_now = new Date()
    let statisticData = []
    //statistic area
    for (let mon = 0; mon <= ts_now.getMonth(); mon++) {
      let first_day_month = new Date(ts_now.getFullYear(), mon, 1).getTime()
      let last_day_month = new Date(ts_now.getFullYear(), mon + 1, 1).getTime()
      let _orderOnMonth = await Order.find({
        isDeleted: false,
        hasPayed: true,
        createdAt: {
          $gte: first_day_month,
          $lt: last_day_month,
        },
      })
      let _revenueOnMonth = _orderOnMonth.length
        ? _orderOnMonth
            .map((x) => x.totalPrice)
            .reduce((a, b) => parseInt(a) + parseInt(b))
        : 0
      statisticData.push(parseInt(_revenueOnMonth))
    }
    //statistic pỉe
    const day_1st = new Date(
      ts_now.getFullYear(),
      ts_now.getMonth(),
      1
    ).getTime()
    const _roomLetterOnThisMonth = await RoomLetter.find({
      isDeleted: false,
      createdAt: {
        $gte: day_1st,
        $lt: Date.now(),
      },
    })
    const _roomCategories = await RoomCategory.find({ isDeleted: false })
    const _orderOnThisMonth = await Order.find({
      isDeleted: false,
      hasPayed: true,
      createdAt: {
        $gte: day_1st,
        $lt: Date.now(),
      },
    })
    let _roomLetterByCate = []
    for (let cate = 0; cate < _roomCategories.length; cate++) {
      let count = 0
      for (let x = 0; x < _roomLetterOnThisMonth.length; x++) {
        const _room = await Room.findById(_roomLetterOnThisMonth[x].roomId)
        if (
          _room &&
          _room.cateOfRoomId.toString() === _roomCategories[cate]._id.toString()
        ) {
          count++
        }
      }
      _roomLetterByCate.push({
        cate_name: _roomCategories[cate].nameOfCategory,
        number: count,
        // number: Math.round((count / _roomLetterOnThisMonth.length) * 100),
      })
    }
    const priceInOrders = _orderOnThisMonth.map((x) => x.totalPrice)
    const _revenueOnThisMonth = priceInOrders.length
      ? priceInOrders.reduce((a, b) => parseInt(a) + parseInt(b))
      : 0
    res.render("pages/dashboard/index", {
      layout: "layout",
      _roomLetterByCate,
      statisticData,
      _freeRooms: _freeRooms.length || 0,
      _orderOnThisMonth: _orderOnThisMonth.length || 0,
      _roomLetterOnThisMonth: _roomLetterOnThisMonth.length || 0,
      _revenueOnThisMonth: _revenueOnThisMonth.toLocaleString() || 0,
      curUser: req.curUser,
      pageTitle: "Dashboard",
    })
  } catch (error) {
    console.log(error)
  }
})

module.exports = router

// const entity = {
//   id: uuidv4(),
//   name: "Thương gia",
//   price: 1000000,
//   note: "",
//   surcharge_rate: 2.0,
//   room_quantity: 10,
//   max_people: 2,
// };
// const result = await categoryModel.addOneCategory(entity);
// router.post("/add", async (req, res) => {
//   try {
//     const {
//       name,
//       price,
//       note,
//       surcharge_rate,
//       room_quantity,
//       max_people,
//     } = req.body;
//     if (!name) {
//       return res.status(400).json({
//         success: false,
//         message: "name is required in body!",
//       });
//     }
//     const entity = {
//       id: uuidv4(),
//       name,
//       price,
//       note,
//       surcharge_rate,
//       room_quantity,
//       max_people,
//     };
//     categoryModel
//       .addOneCategory(entity)
//       .then((response) => {
//         return res.json({
//           success: true,
//           response,
//         });
//       })
//       .catch((err) => {
//         return res.status(400).json({
//           success: false,
//           message: err.toString(),
//         });
//       });
//   } catch (error) {
//     return res.status(400).json({
//       success: false,
//       message: error.toString(),
//     });
//   }
// });
