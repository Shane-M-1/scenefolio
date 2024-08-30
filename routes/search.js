const express = require('express');
const router = express.Router();
const TMDB = require('./../tmdb');

router.get('/', async (req, res) => {
  const results = await TMDB.search(req.query.search);
  res.render('results', {results: results, isExplore: false, query: 'Showing results for "' + req.query.search + '"'});
});

module.exports = router;