const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
    req.session.destroy(function () {
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
});

module.exports = router