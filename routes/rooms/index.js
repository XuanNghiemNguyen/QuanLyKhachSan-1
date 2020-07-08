const express = require('express')
const router = express.Router()
const Room = require('../../models/room.model')
router.get('/views', async (req, res) => {
  try {
    const _rooms = await Room.find({ isDeleted: false })
    res.render('pages/rooms/index', { layout: 'layout', data: _rooms || [] })
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
