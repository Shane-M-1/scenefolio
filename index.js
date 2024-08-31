require('dotenv').config();
const express = require("express");
const app = express();
const path = require('path');
const imgPath = 'https://image.tmdb.org/t/p/original';
const mongoose = require('mongoose');
const TMDB = require('./tmdb');
const explore = require('./routes/explore');
const users = require('./routes/users');
const all = require('./routes/all');
const search = require('./routes/search');
const session = require('express-session');
const flash = require('connect-flash');
const secret = process.env.SECRET;
const db_key = process.env.DB_KEY;
const MongoStore = require('connect-mongo');

mongodb://localhost:27017/movieApp
mongoose.connect(db_key)
  .then(() => {
    console.log('MongoDB connection started');
  })
  .catch((e) => {
    console.log(e);
  });

const store = MongoStore.create({
  mongoUrl: db_key,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret: secret
  }
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({secret: secret, resave: false, saveUninitialized: false, store}));
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

app.all('*', (req, res) => {
  req.flash('error', "Sorry we can't find the page you are looking for!");
  res.redirect('/explore');
});

app.listen(3000, () => {
  console.log("App started");
});

app.use((err, req, res, next) => {
  if (req.fromExplore) {
    res.send(err.message);
  } else {
    req.flash('error', err.message);
    res.redirect('/explore');
  }
});