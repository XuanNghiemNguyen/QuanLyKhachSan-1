const express = require('express')
const router = express.Router()

router.get('/room-categories', async (req, res) => {
  try {
    res.render("pages/room-categories/index", { layout: "layout" });
  } catch (error) {
    console.log(error);
  }
})

module.exports = router