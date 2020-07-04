const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const roomModel = require("../../models/room.model");

router.get("/views", async (req, res) => {
  try {
    const data = await roomModel.getAllRoom();
    res.render("pages/rooms/index", { layout: "layout", data });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router