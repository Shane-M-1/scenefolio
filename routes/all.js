const express = require('express');
const router = express.Router();
const TMDB = require('./../tmdb');

router.get('/:page', async (req, res, next) => {
  try {
    const m = await TMDB.getAllPopular(req.params.page);
    if (m) {
      res.render('results', {results: m, isExplore: true, nextPage: parseInt(req.params.page) + 1, query: `Showing Page ${req.params.page} of Popular Today`});
    } else {
      res.send('Oops! Gone one page too far!'); // eventually add real handling
    }
  } catch (e) {
    e.message = 'Error fetching movies!';
    next(e);
  }
});

router.all('*', (req, res) => {
  req.flash('error', "Sorry we can't find the page you are looking for!");
  res.redirect('/explore');
});

module.exports = router;