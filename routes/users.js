const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('./../models/user');
const Wish = require('./../models/wishlist');
const Watch = require('./../models/watchlist');
const TMDB = require('./../tmdb');
const isLoggedIn = require('../middleware');

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.post('/signup', async (req, res, next) => {
  try {
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
  } catch (e) {
    e.message = 'Error creating account!';
    next(e);
  }
  
});

router.post('/login', async (req, res, next) => {
  try {
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
  } catch (e) {
    e.message = 'Error logging in!';
    next(e);
  }
  
});

router.get('/signout', (req, res) => {
  req.session.user_id = null;
  req.flash('success', 'Logged Out');
  res.redirect('/users/login');
});

router.get('/wishlist/:page', async (req, res, next) => {
  try {
    const movies = await Wish.find({user_id: req.session.user_id});
    const arr = [];
    for (let elem of movies) {
      const m = await TMDB.getMovie(elem.mID);
      arr.push(m)
    }
    res.render('wish', {movies: arr});
  } catch (e) {
    e.message = 'Error fetching wishlist!';
    next(e);
  }
  
});

router.get('/watchlist/:page', async (req, res, next) => {
  try {
    const movies = await Watch.find({user_id: req.session.user_id});
    const arr = [];

    for (let elem of movies) {
      const m = await TMDB.getMovie(elem.mID);
      arr.push(m)
    }
    res.render('watch', {movies: arr});
  } catch (e) {
    e.message = 'Error fetching watchlist!';
    next(e);
  }
  
});

router.get('/watch-info/:id', isLoggedIn, async (req, res, next) => {
  try {
    const data = await TMDB.getMovie(req.params.id);
    const backdrop = await TMDB.getBackdrop(req.params.id);
    const stars = await TMDB.getStars(req.params.id);
    const dir = await TMDB.getDirector(req.params.id);
    const writers = await TMDB.getWriters(req.params.id);
    const db = await Watch.findOne({mID: req.params.id, user_id: req.session.user_id});
    res.render('watchedInfo', {movie: data, backdrop: 'https://image.tmdb.org/t/p/original' + backdrop, stars: stars, director: dir, writers: writers, rating: db.rating, comment: db.comment});
  } catch (e) {
    e.message = 'Error fetching movie information!'
    next(e);
  }
  
});

router.post('/watch-update', async (req, res, next) => {
  try {
    const {mID, rating, comment} = req.body;
    const updatedMovie = await Watch.findOneAndUpdate({mID, user_id: req.session.user_id, rating, comment});
    await updatedMovie.save();
    res.redirect('/users/watch-info/' + mID);
  } catch (e) {
    e.message = 'Error updating watched list!'
    next(e);
  }
  
});

router.post('/watch-delete', async (req, res, next) => {
  try {
    const { mID } = req.body;
    await Watch.findOneAndDelete({mID: mID, user_id: req.session.user_id});
    res.redirect('/users/watchlist/1');
  } catch (e) {
    e.message = 'Error removing from watched list!'
    next(e);
  }
  
});

router.all('*', (req, res) => {
  req.flash('error', "Sorry we can't find the page you are looking for!");
  res.redirect('/explore');
});

module.exports = router;