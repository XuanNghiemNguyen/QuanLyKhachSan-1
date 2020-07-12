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
    res.render("pages/login/index", { layout: false });
  } catch (error) {
    console.log(error);
  }
});

router.post('/', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login'
}));

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