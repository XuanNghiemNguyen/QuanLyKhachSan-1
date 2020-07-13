const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const Users = require('../../models/user.model')

router.get('/', async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      res.redirect('/dashboard');
    }
    res.render("pages/login/index", { layout: false, clientName: `${process.env.CLIENT_NAME}` });
  } catch (error) {
    console.log(error);
  }
});

router.post('/', passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: true
}), (req, res) => {
  // Remember check box is checked
  if (req.body.isRemember) {
    req.session.cookie.expires = new Date(253402300000000); // set the expired date to year 10000
  }
  res.redirect('/dashboard');
});

passport.use(new LocalStrategy(
  async function (username, password, done) {
    try {
      var User = await Users.find({ email: username });
      if (User.length == 0) {
        return done(null, false, { message: 'Invalid username.' });
      }
      if (bcrypt.compareSync(password, User[0].password) == false) {
        return done(null, false, { message: 'Wrong password.' });
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

passport.deserializeUser(function (user, done) {
  Users.findById(user._id, function (err, receivedUser) {
    done(err, receivedUser);
  });
});

module.exports = router