const express = require('express');
const mysql = require('mysql')
const app = express();
const api = require('./routes/api');
const dotenv = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser');
const cookie = require('cookie-parser');
const session = require('express-session');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, './public')));

app.use(cookie());
app.use(session({
    key: 'user_sid',
    secret: 'mysecretKey',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));

dotenv.config({
    path: './.env'
})

const db = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
})

db.connect(function(err) {
    if (err) throw err;
    console.log('database connected successfully...');
})

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use('/', api);



app.listen(3000, function() {
    console.log('server is running on port 3000...');
})