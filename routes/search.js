const express = require('express');
const router = express.Router();
const TMDB = require('./../tmdb');

router.get('/', async (req, res) => {
  console.log(req.query.search);
  const results = await TMDB.search(req.query.search);
  res.render('results', {results: results, isExplore: false});
});

module.exports = router;