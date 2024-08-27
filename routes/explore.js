const express = require('express');
const router = express.Router();
const TMDB = require('./../tmdb');
const imgPath = process.env.IMG_PATH;

router.get('/:id', async (req, res) => {
  const data = await TMDB.getMovie(req.params.id);
  const backdrop = await TMDB.getBackdrop(req.params.id);
  const stars = await TMDB.getStars(req.params.id);
  const dir = await TMDB.getDirector(req.params.id);
  const writers = await TMDB.getWriters(req.params.id);
  res.render('movieinfo', {movie: data, backdrop: imgPath + backdrop, stars: stars, director: dir, writers: writers});
});

router.get('/', async (req, res) => {
  const m = await TMDB.getPopularCarousel();
  res.render('explore', {movies: m});
});

module.exports = router;