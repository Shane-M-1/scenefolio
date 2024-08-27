require('dotenv').config();
const express = require("express");
const app = express();
const path = require('path');
const imgPath = process.env.IMG_PATH;
const port = process.env.PORT;
const mongoose = require('mongoose');
const User = require('./models/user');
const TMDB = require('./tmdb');
const explore = require('./routes/explore');
const users = require('./routes/users');
const all = require('./routes/all');
const search = require('./routes/search');

mongoose.connect('mongodb://localhost:27017/movieApp')
  .then(() => {
    console.log('MongoDB connection started');
  })
  .catch((e) => {
    console.log(e);
  });


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/explore', explore);
app.use('/users', users);
app.use('/all', all);
app.use('/search', search);

app.get('/', async (req, res) => {
  const poster = await TMDB.getImg(533535);
  const t = await TMDB.getTitle(533535);
  res.render('home', {img: imgPath + poster, title: t});
    // const data = await getMovie(533535);
    // res.render('home', {img: imgPath + data.poster_path, title: data.title});
});

app.use((req, res) => {
  res.send("Hello response");
});

app.listen(port, () => {
  console.log("App started");
});

// app.get('/explore/:id', async (req, res) => {
//   const data = await TMDB.getMovie(req.params.id);
//   const backdrop = await TMDB.getBackdrop(req.params.id);
//   const stars = await TMDB.getStars(req.params.id);
//   const dir = await TMDB.getDirector(req.params.id);
//   const writers = await TMDB.getWriters(req.params.id);
//   res.render('movieinfo', {movie: data, backdrop: imgPath + backdrop, stars: stars, director: dir, writers: writers});
// });

// app.get('/explore', async (req, res) => {
//   // const p = await getImg();
//   // const t = await getTitle();
//   const m = await TMDB.getPopularCarousel();
//   res.render('explore', {movies: m});
// });

// app.get('/search', async (req, res) => {
//   console.log(req.query.search);
//   const results = await TMDB.search(req.query.search);
//   res.render('results', {results: results, isExplore: false});
// });

// app.get('/all/:page', async (req, res) => {
//   const m = await TMDB.getAllPopular(req.params.page);
//   if (m) {
//     res.render('results', {results: m, isExplore: true, nextPage: parseInt(req.params.page) + 1});
//   } else {
//     res.send('Oops! Gone one page too far!'); // eventually add real handling
//   }
  
// });

// app.get('/users/login', async (req, res) => {
//   res.render('login');
// })

// app.get('/users/signup', async (req, res) => {
//   res.render('signup');
// })

