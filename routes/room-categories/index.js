const express = require('express')
const router = express.Router()
const RoomCategory = require('../../models/room-category.model')
const Room = require('../../models/room.model')
const User = require('../../models/user.model')

router.get('/views', async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      let _roomCategories = await RoomCategory.find({})
      if (_roomCategories && _roomCategories.length > 0) {
        for (let i = 0; i < _roomCategories.length; i++) {
          _roomCategories[i].roomQuantity =
            (
              await Room.find({
                cateOfRoomId: _roomCategories[i]._id,
              })
            ).length || 0
          const createdByUser = await User.findById(_roomCategories[i].createdBy)
          _roomCategories[i].createdByUser = createdByUser
            ? createdByUser.name
            : ''
        }
      }
      res.render('pages/room-categories/index', {
        layout: 'layout',
        data: _roomCategories || [],
      })
    }
  } catch (error) {
    console.log(error)
  }
})

router.post('/add', async (req, res) => {
  try {
    const createdBy = '5f02c588e88cb9194897288d' // id employee or admin
    const { nameOfCategory, note, price } = req.body
    const _roomCategory = new RoomCategory({ isDeleted: false })
    _roomCategory.nameOfCategory = nameOfCategory
    _roomCategory.note = note
    _roomCategory.price = parseInt(price)
    _roomCategory.createdBy = createdBy
    await _roomCategory.save()
    return res.redirect('/room-categories/views')
  } catch (error) {
    console.log(error)
    res.render(error)
  }
})
module.exports = router
