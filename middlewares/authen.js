const isLogged = (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
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
