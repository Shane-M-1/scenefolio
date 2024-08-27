require('dotenv').config();
const key = process.env.API_KEY;
const basePath = process.env.BASE_PATH;
const imgPath = process.env.IMG_PATH;
const axios = require('axios');

const TMDB = {
  
  getMovie: async function (id) {
    const response = await axios.get(basePath + '/movie/' + id + key);
    return response.data;
  },
  
  getImg: async function (id) {
    const response = await axios.get(basePath + '/movie/' + id + key);
    return response.data.poster_path;
  },
  
  getTitle: async function (id) {
    const response = await axios.get(basePath + '/movie/' + id + key);
    return response.data.title;
  },
  
  getBackdrop: async function (id) {
    const response = await axios.get(basePath + '/movie/' + id + '/images' + key);
  
    if (response.data.backdrops[0]) {
      return response.data.backdrops[0].file_path;
    } else {
      return 'n/a';
    }
    
  },
  
  getStars: async function (id) {
    const response = await axios.get(basePath + '/movie/' + id + '/credits' + key);
    const stars = [];
    for (let i = 0; i < 4; i++) {
      stars[i] = response.data.cast[i];
    }
    return stars;
  },
  
  getOverview: async function (id) {
    const response = await axios.get(basePath + '/movie/' + id + key);
    return response.data.overview;
  },
  
  getRating: async function (id) {
    const response = await axios.get(basePath + '/movie/' + id + key);
    return response.data.vote_average;
  },
  
  getYear: async function (id) {
    const response = await axios.get(basePath + '/movie/' + id + key);
    return response.data.release_date.substring(0, 4);
  },
  
  getTopGenres: async function (id) {
    const response = await axios.get(basePath + '/movie/' + id + key);
    const genres = [];
    genres[0] = response.data.genres[0].name;
    genres[1] = response.data.genres[1].name;
    return genres;
  }, 
  
  getRuntime: async function (id) {
    const response = await axios.get(basePath + '/movie/' + id + key);
    return response.data.runtime;
  },
  
  getDirector: async function (id) {
    const response = await axios.get(basePath + '/movie/' + id + '/credits' + key);
    const dir = [];
    for (const e of response.data.crew) {
      if (e.job === 'Director') {
        dir.push(e.name);
      }
    }
    return dir;
  },
  
  getWriters: async function (id) {
    const response = await axios.get(basePath + '/movie/' + id + '/credits' + key);
    return response.data.crew.filter(({job})=> job ==='Writer');
  },
  
  getTagline: async function (id) {
    const response = await axios.get(basePath + '/movie/' + id + key);
    return response.data.tagline;
  },
  
  getRecommendations: async function (id) {
    const response = await axios.get(basePath + '/movie/' + id + '/recommendations' + key);
  },
  
  getPopularCarousel: async function () {
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
  },
  
  search: async function (query) {
    const response = await axios.get(basePath + '/search/movie' + key + '&query=' + query);
    // console.log(response.data);
    return response.data.results;
  },
  
  getAllPopular: async function (page) {
    const response = await axios.get(basePath + '/discover/movie' + key + '&sort_by=popularity.desc' + '&page=' + page);
    return response.data.results;
  }

};

module.exports = TMDB;