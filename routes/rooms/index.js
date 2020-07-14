const express = require('express')
const router = express.Router()
const Room = require('../../models/room.model')
const RoomCategory = require("../../models/room-category.model")

router.get('/views', async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      const _rooms = await Room.find({ isDeleted: false })
      const _roomCates = await RoomCategory.find({ isDeleted: false })

      if (_rooms && _rooms.length > 0) {
        for (let i = 0; i < _rooms.length; i++) {
          const cate = await RoomCategory.findById(
            _rooms[i].cateOfRoomId
          )
          _rooms[i].cate = cate
            ? cate.nameOfCategory
            : ""
        }
      }
      res.render('pages/rooms/index', { layout: 'layout', data: _rooms, dataCate: _roomCates || [] })
    }
    else {
      res.redirect('/login')
    }
  } catch (error) {
    console.log(error)
  }
})

router.post("/add", async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      const createdBy = "5f02c588e88cb9194897288d" // id employee or admin
      const { nameOfRoom, cateOfRoomId, maxPeople, note, price, status } = req.body
      const _room = new Room({})
      _room.nameOfRoom = nameOfRoom
      _room.cateOfRoomId = cateOfRoomId
      _room.note = note
      _room.status = status
      _room.price = parseInt(price)
      _room.maxPeople = parseInt(maxPeople)
      _room.createdBy = createdBy
      await _room.save()
      return res.redirect("/rooms/views")
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
      const { id, nameOfRoom, cateOfRoomId, price, maxPeople, note, status } = req.body
      if (!id) {
        return
      }
      const _room = await Room.findById(id)
      if (_room) {
        if (nameOfRoom) _room.nameOfRoom = nameOfRoom
        if (cateOfRoomId) _room.cateOfRoomId = cateOfRoomId
        if (price) _room.price = price
        if (status) _room.status = status
        if (maxPeople) _room.maxPeople = maxPeople
        if (note) _room.note = note
        await _room.save()
      }
      return res.redirect("/rooms/views")
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
        console.log('id not found')
        return
      }
      const _room = await Room.findById(id)
      console.log("nghiem", _room)
      if (_room) _room.isDeleted = true
      await _room.save()
      return res.redirect("/rooms/views")
    } else {
      return res.redirect("/login")
    }
  } catch (error) {
    console.log(error)
    res.render(error)
  }
})

module.exports = router
