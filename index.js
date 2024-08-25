require('dotenv').config();
const axios = require('axios');
const express = require("express");
const app = express();
const path = require('path');
const key = process.env.API_KEY;
const basePath = process.env.BASE_PATH;
const imgPath = process.env.IMG_PATH;
const port = process.env.PORT;
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.get('/', async (req, res) => {
  // const poster = await getImg();
  // const t = await getTitle();
  // res.render('home', {img: imgPath + poster, title: t});
    const data = await getMovie(533535);
    res.render('home', {img: imgPath + data.poster_path, title: data.title});
});

app.get('/explore/:id', async (req, res) => {
  // const stars = await getStars(id);
  // const poster = await getImg(id);
  // const title = await getTitle(id);
  // const desc = await getOverview(id);
  // const bd = await getBackdrop(id);
  // const vote = await getRating(id);
  // const yr = await getYear(id);
  // const g = await getTopGenres(id);
  // const r = await getRuntime(id);
  // const d = await getDirector(id);
  // const w = await getWriters(id);
  // const t = await getTagline(id);
  // res.render('movieinfo', {movieTitle: title, posterImg: imgPath + poster, description: desc, backdrop: imgPath + bd, rating: vote, year: yr, genres: g, runtime: r, director: d, writers: w, stars: stars, tagline: t});
  const data = await getMovie(req.params.id);
  const backdrop = await getBackdrop(req.params.id);
  const stars = await getStars(req.params.id);
  const dir = await getDirector(req.params.id);
  const writers = await getWriters(req.params.id);
  res.render('movieinfo', {movie: data, backdrop: imgPath + backdrop, stars: stars, director: dir, writers: writers});
});

app.get('/explore', async (req, res) => {
  // const p = await getImg();
  // const t = await getTitle();
  const m = await getPopular();
  res.render('explore', {movies: m});
});

app.use((req, res) => {
  res.send("Hello response");
});



app.listen(port, () => {
  console.log("app started");
});

async function getMovie(id) {
  const response = await axios.get(basePath + '/movie/' + id + key);
  return response.data;
}

async function getImg(id) {
  const response = await axios.get(basePath + '/movie/' + id + key);
  return response.data.poster_path;
}

async function getTitle(id) {
  const response = await axios.get(basePath + '/movie/' + id + key);
  return response.data.title;
}

async function getBackdrop(id) {
  const response = await axios.get(basePath + '/movie/' + id + '/images' + key);

  return response.data.backdrops[0].file_path;
}

async function getStars(id) {
  const response = await axios.get(basePath + '/movie/' + id + '/credits' + key);
  const stars = [];
  for (let i = 0; i < 4; i++) {
    stars[i] = response.data.cast[i];
  }
  return stars;
}

async function getOverview(id) {
  const response = await axios.get(basePath + '/movie/' + id + key);
  return response.data.overview;
}

async function getRating(id) {
  const response = await axios.get(basePath + '/movie/' + id + key);
  return response.data.vote_average;
}

async function getYear(id) {
  const response = await axios.get(basePath + '/movie/' + id + key);
  return response.data.release_date.substring(0, 4);
}

async function getTopGenres(id) {
  const response = await axios.get(basePath + '/movie/' + id + key);
  const genres = [];
  genres[0] = response.data.genres[0].name;
  genres[1] = response.data.genres[1].name;
  return genres;
}

async function getRuntime(id) {
  const response = await axios.get(basePath + '/movie/' + id + key);
  return response.data.runtime;
}

async function getDirector(id) {
  const response = await axios.get(basePath + '/movie/' + id + '/credits' + key);
  const dir = [];
  for (const e of response.data.crew) {
    if (e.job === 'Director') {
      dir.push(e.name);
    }
  }
  return dir;
}

async function getWriters(id) {
  const response = await axios.get(basePath + '/movie/' + id + '/credits' + key);
  return response.data.crew.filter(({job})=> job ==='Writer');
}

async function getTagline(id) {
  const response = await axios.get(basePath + '/movie/' + id + key);
  return response.data.tagline;
}

async function getRecommendations(id) {
  const response = await axios.get(basePath + '/movie/' + id + '/recommendations' + key);
}

async function getPopular() {
  const response = await axios.get(basePath + '/discover/movie' + key + '&sort_by=popularity.desc');
  const movies = [];
  let i = 0;
  let temp = [];

  for (const e of response.data.results) {
    temp.push(e);
    i++;
    if (i == 6) {
      movies.push(temp);
      temp = [];
      i = 0;
    }
  }
  return movies;
}