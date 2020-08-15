const { notification } = require("../common/index")
const isLogged = (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      ;(req.curUser = {
        _id: req.user._id,
        name: req.user.name || "Người dùng",
        email: req.user.email,
        type: req.user.type,
        avatar:
          req.user.avatar ||
          "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/768px-User_icon_2.svg.png",
      }),
        next()
    } else {
      return res.redirect("/login")
    }
  } catch (error) {
    console.log(error)
  }
}

const isAdmin = (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      if (!req.curUser.type || req.curUser.type !== "admin") {
        return res.render("pages/permission-denied", {
          layout: "layout",
          curUser: req.curUser,
          pageTitle: "Chức năng quản trị viên",
          notification: notification(false),
        })
      }
      next()
    } else {
      return res.redirect("/login")
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  isLogged,
  isAdmin,
}
