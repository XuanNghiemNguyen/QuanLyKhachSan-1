const isLogged = (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      req.curUser = {
        name: req.user.name || 'Người dùng',
        avatar:
          req.user.avatar ||
          "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/768px-User_icon_2.svg.png",
      },
      next()
    } else {
      return res.redirect("/login")
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  isLogged
}