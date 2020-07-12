const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const Users = require('../../models/user.model')
router.post('/add', async (req, res) => {
  try {
    const { name, password, email, address } = req.body
    if (!name || !password || !address) {
      return res.json({
        success: true,
        message: 'require fields: name, password, address!'
      })
    }
    const _user = new Users()
    const hash = bcrypt.hashSync(password, 10)
    _user.name = name
    _user.password = hash
    _user.email = email
    _user.address = address || ''
    await _user.save()
    return res.json({
      success: true,
      user: _user,
    })
  } catch (error) {
    console.log(error)
    return res.json({
      success: true,
      user: _user,
    })
  }
})
module.exports = router
