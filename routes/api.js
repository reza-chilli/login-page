const express = require('express');
const router = express.Router();
const auth = require('./auth');
const dashboard = require('./dashboard');

router.use('/auth', function(req, res, next) {
    if (req.session.user) {
        return res.redirect('/dashboard')
    } else {
        return next()
    }
})

router.use('/dashboard', function(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/auth/register')
    } else {
        return next()
    }
})

router.use('/auth', auth);
router.use('/dashboard', dashboard);




module.exports = router;