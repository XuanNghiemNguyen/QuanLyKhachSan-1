const express = require("express");
const router = express.Router();

router.get("/views", async (req, res) => {
  try {
    res.render("pages/rooms/index", { layout: "layout" });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router