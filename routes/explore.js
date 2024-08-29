const express = require('express');
const router = express.Router();
const TMDB = require('./../tmdb');
const imgPath = process.env.IMG_PATH;
const Wish = require('./../models/wishlist');

const isLoggedIn = (req, res, next) => {
  if (req.session.user_id) {
    next();
  } else {
    req.flash('error', 'Login or create an account to create a wishlist!');
    res.redirect('/users/login');
  }
}

router.get('/:id', async (req, res) => {
  const data = await TMDB.getMovie(req.params.id);
  const backdrop = await TMDB.getBackdrop(req.params.id);
  const stars = await TMDB.getStars(req.params.id);
  const dir = await TMDB.getDirector(req.params.id);
  const writers = await TMDB.getWriters(req.params.id);
  let inList = false;
  if (req.session.user_id) {
    const movie = await Wish.findOne({mID: data.id, user_id: req.session.user_id});
    if (movie) {
      inList = true;
    }
  }
  res.render('movieinfo', {movie: data, backdrop: imgPath + backdrop, stars: stars, director: dir, writers: writers, inList: inList});
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
  res.render('explore', {movies: m});
});

module.exports = router;