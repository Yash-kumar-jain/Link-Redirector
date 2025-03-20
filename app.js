const express = require('express');
const expressSession = require('express-session');
require('dotenv').config();
const app = express();
const path = require('path');
const flash = require("connect-flash")
const cookieParser = require("cookie-parser");


app.use(flash()); 

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

const indexRouter = require('./routes/indexRouter')
const db = require('./config/mongoose')


app.use(expressSession({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,

}))

app.use('/', indexRouter);


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});