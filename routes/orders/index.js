const express = require("express")
const router = express.Router()
const Customer = require("../../models/customer.model")
const RoomLetter = require("../../models/room-letter.model")
const Order = require("../../models/order.model")
const { notification } = require("../../common/index")
router.get("/views", async (req, res) => {
  try {
    let _orders = (await Order.find({ isDeleted: false })) || []
    for (let c = 0; c < _orders.length; c++) {
      const cus = await Customer.findById(_orders[c].customerId)
      _orders[c].customerName = cus ? cus.name : ""
      const _roomLetters = await RoomLetter.find({
        "_id": { "$in": _orders[c].roomLetterIds },
      })
      _orders[c]["roomLetters"] = _roomLetters
    }
    const dataCustomer = await Customer.find({ isDeleted: false })
    res.render("pages/orders/index", {
      layout: "layout",
      data: _orders,
      curUser: req.curUser,
      dataCustomer: dataCustomer || [],
      pageTitle: "Hóa đơn thanh toán",
      notification: notification(false)
    })
  } catch (error) {
    console.log(error)
  }
})

router.post("/add", async (req, res) => {
  try {
    const { customerId } = req.body
    if (!customerId) {
      console.log("id not found")
      return res.redirect("/orders/views")
    }
    const _roomLetters = await RoomLetter.find({
      customerId: customerId,
      isDeleted: false,
      hasPayed: false,
    })
    if (!_roomLetters || !_roomLetters.length) {
      return res.redirect("/orders/views")
    }

    let _order = new Order()
    let totalPrice = 0
    for (let i = 0; i < _roomLetters.length; i++) {
      _order.roomLetterIds.push(_roomLetters[i]._id)
      totalPrice += parseInt(_roomLetters[i].price)
      _roomLetters[i].hasPayed = true
      const room = Room.findById(_roomletters[i].roomId)
      if (room) {
        room.status = "Còn trống"
        await room.save()
      }
      await _roomLetters[i].save()
    }
    _order.employeeId = req.curUser._id
    _order.totalPrice = totalPrice
    _order.customerId = customerId
    _order.createdAt = Date.now()

    await _order.save()
    return res.redirect("/orders/views")
  } catch (error) {
    console.log(error)
  }
})

router.post("/payment", async (req, res) => {
  try {
    const { id } = req.body
    if (!id) {
      console.log("id not found")
      return
    }
    const _order = await Order.findOne({_id: id, isDeleted: false})
    if (_order) {
      _order.hasPayed = true
      await _order.save()
    }
    return res.redirect("/orders/views")
  } catch (error) {
    console.log(error)
  }
})

router.post("/delete", async (req, res) => {
  try {
    const { id } = req.body
    if (!id) {
      console.log("id not found")
      return
    }
    const _order = await Order.findById(id)
    if (_order && !_order.isDeleted) {
      console.log(_order)
      _order.isDeleted = true
      await _order.save()
    }
    return res.redirect("/orders/views")
  } catch (error) {
    console.log(error)
  }
})

// router.get("/views", async (req, res) => {
//   try {
//     let roomletters = await RoomLetter.find({
//       isDeleted: false,
//       hasPayed: false,
//     })
//     let ordersNotPayed = await Order.find({ isDeleted: false, hasPayed: false })
//     let customerIdInOrder = []
//     let roomletterInOrder = []
//     for (let i = 0; i < ordersNotPayed.length; i++) {
//       let roomlettersInOrder = await RoomLetter.findById(
//         ordersNotPayed[i].roomLetterIds[0]
//       )
//       customerIdInOrder.push(roomlettersInOrder.customerId)
//       for (let j = 0; j < ordersNotPayed[i].roomLetterIds.length; j++) {
//         roomletterInOrder.push(ordersNotPayed[i].roomLetterIds[j])
//       }
//     }

//     for (let i = 0; i < roomletters.length; i++) {
//       let dup = false // check if roomletters[i]._id exists in Order or not
//       for (let j = 0; j < roomletterInOrder.length; j++) {
//         if (roomletters[i]._id.toString() == roomletterInOrder[j]) {
//           dup = true
//           break
//         }
//       }
//       if (!dup) {
//         // has not been added to order
//         let exitCustomer = false
//         for (let k = 0; k < customerIdInOrder.length; k++) {
//           if (customerIdInOrder[k] == roomletters[i].customerId.toString()) {
//             exitCustomer = true
//           }
//         }
//         if (!exitCustomer) {
//           // do not have same customer
//           const _orders = new Order({})
//           _orders.roomLetterIds.push(roomletters[i]._id)
//           _orders.totalPrice = roomletters[i].price
//           _orders.employeeId = req.curUser._id.toString()
//           await _orders.save()
//           // update
//           customerIdInOrder.push(roomletters[i].customerId)
//           roomletterInOrder.push(roomletters[i]._id)
//         } else {
//           // have same customer
//           const roomletterId = roomletters[i]._id
//           let roomletterWithSameCustomer = await RoomLetter.findOne({
//             customerId: roomletters[i].customerId,
//           })
//           let order = await Order.findOne({
//             roomLetterIds: roomletterWithSameCustomer._id,
//           })
//           console.log(order.totalPrice)
//           if (order) {
//             order.roomLetterIds.push(roomletterId)
//             order.totalPrice += roomletters[i].price
//             console.log(order)
//             await order.save()
//           }
//         }
//       }
//     }
//     let _orders = await Order.find({ isDeleted: false })
//     if (_orders && _orders.length > 0) {
//       for (let i = 0; i < _orders.length; i++) {
//         const createdByUser = await User.findById(_orders[i].employeeId)
//         _orders[i].createdByUser = createdByUser ? createdByUser.name : ""
//       }
//     }

//     res.render("pages/orders/index", {
//       layout: "layout",
//       data: _orders || [],
//       curUser: req.curUser,
//       pageTitle: "Hóa đơn thanh toán",
//     })
//   } catch (error) {
//     console.log(error)
//   }
// })

module.exports = router
