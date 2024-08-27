const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('./../models/user');

router.get('/login', async (req, res) => {
  res.render('login');
});

router.get('/signup', async (req, res) => {
  res.render('signup');
});

router.post('/signup', async (req, res) => {
  const {username, password, email} = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = new User({
    username, 
    password: hashedPassword,
    email
  });
  await user.save();
  req.session.user_id = user._id;
  res.redirect('/explore');
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

module.exports = router;