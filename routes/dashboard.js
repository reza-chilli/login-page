const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    res.render('dashboard', {user : req.session.user, active : true})
})

router.get('/logout', function(req, res) {
    req.session.destroy();
    res.redirect('/auth/register');
})



module.exports = router;