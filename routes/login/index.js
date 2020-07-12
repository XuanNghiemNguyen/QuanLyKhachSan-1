const express = require('express');
const router = express.Router()
const passport = require('passport');
const session = require('express-session');
const bodyParser = require('body-parser');
const LocalStrategy = require('passport-local').Strategy

router.get('/', async (req, res) => {
  try {
    res.render("pages/login/index", { layout: false });
  } catch (error) {
    console.log(error);
  }
});

router.use(bodyParser.urlencoded({ extended: true }));
router.use(session({ secret: "hotelSecret" }));
router.use(passport.initialize());
router.use(passport.session());

router.post('/', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login'
}));

passport.use(new LocalStrategy(
  function (username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Invalid username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    });
  }
));

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

module.exports = router