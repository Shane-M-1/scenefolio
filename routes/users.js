const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('./../models/user');
const Wish = require('./../models/wishlist');
const TMDB = require('./../tmdb');

router.get('/login', async (req, res) => {
  res.render('login');
});

router.get('/signup', async (req, res) => {
  res.render('signup');
});

router.post('/signup', async (req, res) => {
  const {username, password, email} = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);
  const sameName = await User.findOne({username});
  const sameEmail = await User.findOne({email});

  if (sameEmail) {
    req.flash('error', 'Account with that email already exists!');
  } else if (sameName) {
    req.flash('error', 'Username already taken!');
  } else {
    const newUser = new User({
      username, 
      password: hashedPassword,
      email
    });
    await newUser.save();
    req.session.user_id = newUser._id;
    return res.redirect('/explore');
  }

  res.redirect('/users/signup');
});

router.post('/login', async (req, res) => {
  const {username, password} = req.body;
  const user = await User.findOne({username: username});
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.user_id = user._id;
    req.flash('success', 'Login Success');
    res.redirect('/explore');
  } else {
    req.flash('error', 'Incorrect username or password');
    res.redirect('/users/login');
  }
});

router.get('/signout', async (req, res) => {
  req.session.user_id = null;
  req.flash('success', 'Logged Out');
  res.redirect('/users/login');
});

router.get('/wishlist/:page', async (req, res) => {
  const movies = await Wish.find({user_id: req.session.user_id});
  const arr = [];

  for (let elem of movies) {
    const m = await TMDB.getMovie(elem.mID);
    console.log(m);
    console.log(arr.push(m));
  }

  console.log(arr[1]);
  res.render('wish', {movies: arr});
});

module.exports = router;