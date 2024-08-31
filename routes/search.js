const express = require('express');
const router = express.Router();
const TMDB = require('./../tmdb');

router.get('/', async (req, res, next) => {
  try {
    const results = await TMDB.search(req.query.search);
    res.render('results', {results: results, isExplore: false, query: 'Showing results for "' + req.query.search + '"'});
  } catch (e) {
    e.message = 'Error fetching movies!'
  }
});

router.all('*', (req, res) => {
  req.flash('error', "Sorry we can't find the page you are looking for!");
  res.redirect('/explore');
});

module.exports = router;