const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const Users = require('../../models/user.model')

router.get('/', async (req, res) => {
  try {
    const message = req.flash('failureMessage');
    if (message == null) {
      message = "";
    }
    if (req.isAuthenticated()) {
      res.redirect('/dashboard');
    }
    return res.render("pages/login/index", { layout: false, clientName: `${process.env.CLIENT_NAME}`, message: message });
  } catch (error) {
    console.log(error);
  }
});

router.post('/', passport.authenticate('local', {
  failureRedirect: '/login'
}), (req, res) => {
  // Remember check box is checked
  if (req.body.isRemember) {
    req.session.cookie.expires = new Date(253402300000000); // set the expired date to year 10000
  }
  return res.redirect('/dashboard');
});

passport.use(new LocalStrategy({ passReqToCallback: true },
  async function (req, username, password, done) {
    try {
      const User = await Users.find({ email: username });
      if (User.length == 0) {
        return done(null, false, req.flash('failureMessage', 'Email không tồn tại'));
      }
      if (bcrypt.compareSync(password, User[0].password) == false) {
        return done(null, false, req.flash('failureMessage', 'Sai mật khẩu'));
      }
      if (User[0].isEnabled == false) {
        return done(null, false, req.flash('failureMessage', 'Tài khoản đã bị khóa'));
      }
      return done(null, User[0]);
    }
    catch (err) {
      console.log(err);
    }
  }
));

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(async (user, done) => {
  await Users.findById(user._id, function (err, receivedUser) {
    done(err, receivedUser);
  });
});

module.exports = router