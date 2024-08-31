const express = require('express');
const router = express.Router();
const TMDB = require('./../tmdb');
const Wish = require('./../models/wishlist');
const Watch = require('./../models/watchlist');
const isLoggedIn = require('./../middleware');

router.get('/:id', async (req, res, next) => {
  try {
    const data = await TMDB.getMovie(req.params.id);
    const backdrop = await TMDB.getBackdrop(req.params.id);
    const stars = await TMDB.getStars(req.params.id);
    const dir = await TMDB.getDirector(req.params.id);
    const writers = await TMDB.getWriters(req.params.id);
    let inWishList = false;
    let inWatchList = false;
    if (req.session.user_id) {
      let movie = await Wish.findOne({mID: data.id, user_id: req.session.user_id});
      if (movie) {
        inWishList = true;
      }
      movie = await Watch.findOne({mID: data.id, user_id: req.session.user_id});
      if (movie) {
        inWatchList = true;
      }
    }
    res.render('movieinfo', {movie: data, backdrop: backdrop, stars: stars, director: dir, writers: writers, inWishList, inWatchList});
  } catch (e) {
    e.message = 'Error fetching movie information!';
    next(e);
  }
});

router.post('/wish-delete', async(req, res, next) => {
  try {
    const { mID } = req.body;
    await Wish.findOneAndDelete({mID: mID, user_id: req.session.user_id});
    res.redirect('/explore/' + mID);
  } catch (e) {
    e.message = 'Error removing from wishlist!'
    next(e);
  }
  
});

router.post('/wish-add', isLoggedIn, async (req, res, next) => {
  try {
    const { mID } = req.body;
    const newMovie = new Wish({
      mID,
      user_id: req.session.user_id
    });
    await newMovie.save();
    res.redirect('/explore/' + mID);
  } catch (e) {
    e.message = 'Error adding to wishlist!';
    next(e);
  }
  
});

router.get('/', async (req, res, next) => {
  try {
    const m = await TMDB.getPopularCarousel();
    let dbM = null;
    if (req.session.user_id) {
      dbM = await TMDB.getWishCarousel(req.session.user_id);
    }
    res.render('explore', {movies: m, wishlist: dbM});
  } catch (e) {
    e.message = 'Error fetching movies!';
    req.fromExplore = true;
    next(e);
  }

});

router.post('/watch-add', isLoggedIn, async (req, res, next) => {
  try {
    const {mID, rating, comment} = req.body;
    const newMovie = new Watch({
      mID,
      rating,
      comment,
      user_id: req.session.user_id
    });
    await newMovie.save();
    res.redirect('/explore/' + mID);
  } catch (e) {
    e.message = 'Error adding to watch list!';
    next(e);
  }
});

router.all('*', (req, res) => {
  req.flash('error', "Sorry we can't find the page you are looking for!");
  res.redirect('/explore');
});

module.exports = router;