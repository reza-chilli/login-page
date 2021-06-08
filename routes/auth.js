const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

dotenv.config({
    path: './.env'
})

const db = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
})


router.get('/register', function(req, res) {
    res.render('register', {registerErr : req.session.registerErr, active : false});
})

router.get('/login', function(req, res) {
    res.render('login', {loginErr : req.session.loginErr, active : false});
})

router.post('/register', function(req, res) {
    const {email, username, password} = req.body;
    if (!email || !username || !password) {
        req.session.registerErr = 'All fields must be filled';
        return res.redirect('/auth/register');
    } else {
        db.query('SELECT * from users where user_name = ? or email = ?', [username, email], function(err, result) {
            if (err) {
                return res.status(500).send("Internal Server Error");
            } else if (result.length > 0) {
                const registerErr = result[0].user_name === username ? 'username already in use' : 'email address already in use';
                req.session.registerErr = registerErr;
                return res.redirect('/auth/register')
            } else {
                bcrypt.genSalt(10, function(err, salt) {
                    if (err) return next(err);
                    bcrypt.hash(password, salt, function(err, hash) {
                        if (err) return next(err);
                        db.query('INSERT INTO users (user_name, user_password, email) values (?, ?, ?)', [username, hash, email], function(err) {
                            if (err) return res.status(500).send(err);
                            req.session.user = {user_name : username, user_password : hash, email};
                            return res.redirect('/dashboard');
                        })
                    })
                })
            }
        })
    }
})

router.post('/login', function(req, res) {
    const {username, password} = req.body;
    if (!username || !password) {
        req.session.loginErr = 'please fill out the form completely!';
        return res.redirect('/auth/login');
    } else {
        db.query('select * from users where user_name = ?', [username], function(err, result) {
            if (result.length === 0) {
                req.session.loginErr = 'user not found or password incorect';
                return res.redirect('/auth/login');
            } else {
                bcrypt.compare(password, result[0].user_password, function(err, isMatch) {
                    if (err) return res.status(500).send('Internal Server Error');
                    if (!isMatch) {
                        req.session.loginErr = 'user not found or password incorect';
                        return res.redirect('/auth/login');
                    } else {
                        req.session.user = result[0];
                        return res.redirect('/dashboard');
                    }
                })
            }
        })
    }
})


module.exports = router;