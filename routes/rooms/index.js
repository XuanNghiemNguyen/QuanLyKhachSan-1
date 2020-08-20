const express = require("express")
const router = express.Router()
const Room = require("../../models/room.model")
const RoomCategory = require("../../models/room-category.model")
const { notification } = require("../../common")

const get_notify = (type) => {
  switch (type) {
    case "login":
      return notification(true, "Thông báo", "Đăng nhập thành công!")
    case "create":
      return notification(true, "Thông báo", "Tạo phòng thành công!")
    case "update":
      return notification(true, "Thông báo", "Cập nhật thành công!")
    case "delete":
      return notification(true, "Thông báo", "Xóa phòng thành công!")
    default:
      break
  }
}

router.get("/views", async (req, res) => {
  try {
    const { _cateId } = req.query
    let _rooms = await Room.find({ isDeleted: false })
    if (_cateId && _cateId.toString() !== "all")
      _rooms = _rooms.filter(
        (i) => i.cateOfRoomId.toString() === _cateId.toString()
      )
    const _roomCates = await RoomCategory.find({ isDeleted: false })
    if (_rooms && _rooms.length > 0) {
      for (let i = 0; i < _rooms.length; i++) {
        const cate = await RoomCategory.findById(_rooms[i].cateOfRoomId)
        _rooms[i].cate = cate ? cate.nameOfCategory : ""
      }
    }
    const { success, type } = req.query
    let notify = {}
    if (success && type) {
      notify = get_notify(type)
    }
    res.render("pages/rooms/index", {
      layout: "layout",
      data: _rooms,
      dataCate: _roomCates || [],
      cateActive: _cateId,
      curUser: req.curUser,
      pageTitle: "Phòng",
      notification: notify,
    })
  } catch (error) {
    console.log(error)
  }
})

router.post("/add", async (req, res) => {
  try {
    const createdBy = req.curUser._id // id employee or admin
    const {
      nameOfRoom,
      cateOfRoomId,
      maxPeople,
      note,
      price,
      status,
    } = req.body
    const _room = new Room({})
    _room.nameOfRoom = nameOfRoom
    _room.cateOfRoomId = cateOfRoomId
    _room.note = note
    _room.status = status
    _room.price = parseInt(price)
    _room.maxPeople = parseInt(maxPeople)
    _room.createdBy = createdBy
    await _room.save()
    return res.redirect("/rooms/views?success=true&type=create")
  } catch (error) {
    console.log(error)
    res.render(error)
  }
})

router.post("/update", async (req, res) => {
  try {
    const {
      id,
      nameOfRoom,
      cateOfRoomId,
      price,
      maxPeople,
      note,
      status,
    } = req.body
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
    return res.redirect("/rooms/views?success=true&type=update")
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
    const _room = await Room.findById(id)
    if (_room) {
      _room.isDeleted = true
      await _room.save()
    }
    return res.redirect("/rooms/views?success=true&type=delete")
  } catch (error) {
    console.log(error)
    res.render(error)
  }
})

module.exports = router
