const express = require("express")
const router = express.Router()
const RoomCategory = require("../../models/room-category.model")
const User = require("../../models/user.model")
const Order = require("../../models/order.model")
const RoomLetter = require("../../models/room-letter.model")

router.get("/views", async (req, res) => {
  try {
    let roomletters = await RoomLetter.find({ isDeleted: false, hasPayed: false })
    let ordersNotPayed = await Order.find({ isDeleted: false, hasPayed: false })
    let customerIdInOrder = []; let roomletterInOrder = [];
    for (let i = 0; i < ordersNotPayed.length; i++) {
      let roomlettersInOrder = await RoomLetter.findById(ordersNotPayed[i].roomLetterIds[0]);
      customerIdInOrder.push(roomlettersInOrder.customerId);
      for (let j = 0; j < ordersNotPayed[i].roomLetterIds.length; j++) {
        roomletterInOrder.push(ordersNotPayed[i].roomLetterIds[j])
      }
    }
    
    for (let i = 0; i < roomletters.length; i++) {
      let dup = false; // check if roomletters[i]._id exists in Order or not
      for(let j = 0; j < roomletterInOrder.length; j++) {
        if (roomletters[i]._id.toString() == roomletterInOrder[j]) {
          dup = true;
          break;
        }
      }
      if (!dup) // has not been added to order
      {
        let exitCustomer = false;
        for (let k = 0; k < customerIdInOrder.length; k++) {
          if (customerIdInOrder[k] == roomletters[i].customerId.toString()) {
            exitCustomer = true;
          }
        }
        if (!exitCustomer) // do not have same customer
        {
          const _orders = new Order({});
          _orders.roomLetterIds.push(roomletters[i]._id);
          _orders.totalPrice = roomletters[i].price
          const employeeId = "5f02c588e88cb9194897288d"; // id employee or admin
          _orders.employeeId = employeeId
          await _orders.save()
          // update
          customerIdInOrder.push(roomletters[i].customerId);
          roomletterInOrder.push(roomletters[i]._id);
        } else { // have same customer
          const roomletterId = roomletters[i]._id;
          let roomletterWithSameCustomer = await RoomLetter.findOne({ customerId: roomletters[i].customerId });
          let order = await Order.findOne({ roomLetterIds: roomletterWithSameCustomer._id })
          console.log(order.totalPrice);
          if (order) {
            order.roomLetterIds.push(roomletterId);
            order.totalPrice += roomletters[i].price;
            console.log(order);
            await order.save()
          }
        }
      }
    }
    let _orders = await Order.find({ isDeleted: false })
    if (_orders && _orders.length > 0) {
      for (let i = 0; i < _orders.length; i++) {
        const createdByUser = await User.findById(_orders[i].employeeId)
        _orders[i].createdByUser = createdByUser
          ? createdByUser.name
          : ""
      }
    }

    res.render("pages/room-categories/index", {
      layout: "layout",
      data: _orders || [],
      curUser: req.curUser
    })
  } catch (error) {
    console.log(error)
  }
})

router.post("/add", async (req, res) => {
  try {
    const createdBy = "5f02c588e88cb9194897288d" // id employee or admin
    const { nameOfCategory, note, price } = req.body
    const _roomCategory = new RoomCategory({})
    _roomCategory.nameOfCategory = nameOfCategory
    _roomCategory.note = note
    _roomCategory.price = parseInt(price)
    _roomCategory.createdBy = createdBy
    await _roomCategory.save()
    return res.redirect("/room-categories/views")
  } catch (error) {
    console.log(error)
    res.render(error)
  }
})

router.post("/update", async (req, res) => {
  try {
    const { id, nameOfCategory, price, note } = req.body
    if (!id) {
      return
    }
    const _roomCategory = await RoomCategory.findById(id)
    if (_roomCategory) {
      if (nameOfCategory) _roomCategory.nameOfCategory = nameOfCategory
      if (price) _roomCategory.price = price
      if (note) _roomCategory.note = note
      await _roomCategory.save()
    }
    return res.redirect("/room-categories/views")
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
    const _roomCategory = await RoomCategory.findById(id)
    if (_roomCategory) {
      _roomCategory.isDeleted = true
      await _roomCategory.save()
    }
    return res.redirect("/room-categories/views")
  } catch (error) {
    console.log(error)
    res.render(error)
  }
})

module.exports = router
