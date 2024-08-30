const express = require('express');
const router = express.Router();
const TMDB = require('./../tmdb');
const imgPath = process.env.IMG_PATH;
const Wish = require('./../models/wishlist');
const Watch = require('./../models/watchlist');
const isLoggedIn = require('./../middleware');

router.get('/:id', async (req, res) => {
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
  res.render('movieinfo', {movie: data, backdrop: imgPath + backdrop, stars: stars, director: dir, writers: writers, inWishList, inWatchList});
});

router.post('/wish-delete', async(req, res) => {
  const { mID } = req.body;
  await Wish.findOneAndDelete({mID: mID, user_id: req.session.user_id});
  res.redirect('/explore/' + mID);
});

router.post('/wish-add', isLoggedIn, async (req, res) => {
  const { mID } = req.body;
  const newMovie = new Wish({
    mID,
    user_id: req.session.user_id
  });
  await newMovie.save();
  res.redirect('/explore/' + mID);
});

router.get('/', async (req, res) => {
  const m = await TMDB.getPopularCarousel();
  let dbM = null;
  if (req.session.user_id) {
    dbM = await TMDB.getWishCarousel(req.session.user_id);
  }
  res.render('explore', {movies: m, wishlist: dbM});
});

router.post('/watch-add', isLoggedIn, async (req, res) => {
  const {mID, rating, comment} = req.body;
  const newMovie = new Watch({
    mID,
    rating,
    comment,
    user_id: req.session.user_id
  });
  await newMovie.save();
  res.redirect('/explore/' + mID);
});

module.exports = router;