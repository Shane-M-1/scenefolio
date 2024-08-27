const mongoose = require('mongoose');

const watchedSchema = new mongoose.Schema({
  mID: {
    type: String,
    required: true
  },
  rating: Number, 
  comment: String
});

const Watchedlist = mongoose.model('Watchedlist', watchedSchema);

module.exports = Watchedlist;