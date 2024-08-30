require('dotenv').config();
const express = require("express");
const app = express();
const path = require('path');
const imgPath = process.env.IMG_PATH;
const mongoose = require('mongoose');
const User = require('./models/user');
const TMDB = require('./tmdb');
const explore = require('./routes/explore');
const users = require('./routes/users');
const all = require('./routes/all');
const search = require('./routes/search');
const session = require('express-session');
const flash = require('connect-flash');

mongoose.connect('mongodb://localhost:27017/movieApp')
  .then(() => {
    console.log('MongoDB connection started');
  })
  .catch((e) => {
    console.log(e);
  });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({secret: 'secret', resave: false, saveUninitialized: false}));
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});
app.use((req, res, next) => {
  if (req.session.user_id) {
    res.locals.authenticated = true;
  } else {
    res.locals.authenticated = false;
  }
  next();
});
app.use('/explore', explore);
app.use('/users', users);
app.use('/all', all);
app.use('/search', search);


app.get('/secret', (req, res) => {
  if (req.session.user_id) {
    res.send('Secret Message');
  } else {
    res.redirect('/users/login');
  }
});

app.get('/', async (req, res) => {
  const poster = await TMDB.getImg(533535);
  const t = await TMDB.getTitle(533535);
  res.render('home', {img: imgPath + poster, title: t});
});

app.use((req, res) => {
  res.send("Hello response");
});

app.listen(3000, () => {
  console.log("App started");
});

