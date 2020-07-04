const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const categoryModel = require('../../models/category.model')


router.get('/views', async (req, res) => {
  try {
    const data = await categoryModel.getAllCategoryRoom();
    res.render("pages/room-categories/index", { layout: "layout", data });
  } catch (error) {
    console.log(error);
  }
})

module.exports = router