const express = require("express")
const { route } = require("express/lib/router")
const router = express.Router()

router.get("/", (req, res) => {
  try {
    res.render("pages/dashboard/index", {
      layout: "layout",
      curUser: req.curUser
    })
  } catch (error) {
    console.log(error)
  }
})

module.exports = router

// const entity = {
//   id: uuidv4(),
//   name: "Thương gia",
//   price: 1000000,
//   note: "",
//   surcharge_rate: 2.0,
//   room_quantity: 10,
//   max_people: 2,
// };
// const result = await categoryModel.addOneCategory(entity);
// router.post("/add", async (req, res) => {
//   try {
//     const {
//       name,
//       price,
//       note,
//       surcharge_rate,
//       room_quantity,
//       max_people,
//     } = req.body;
//     if (!name) {
//       return res.status(400).json({
//         success: false,
//         message: "name is required in body!",
//       });
//     }
//     const entity = {
//       id: uuidv4(),
//       name,
//       price,
//       note,
//       surcharge_rate,
//       room_quantity,
//       max_people,
//     };
//     categoryModel
//       .addOneCategory(entity)
//       .then((response) => {
//         return res.json({
//           success: true,
//           response,
//         });
//       })
//       .catch((err) => {
//         return res.status(400).json({
//           success: false,
//           message: err.toString(),
//         });
//       });
//   } catch (error) {
//     return res.status(400).json({
//       success: false,
//       message: error.toString(),
//     });
//   }
// });
