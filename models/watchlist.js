const mongoose = require('mongoose');

const watchedSchema = new mongoose.Schema({
  mID: {
    type: Number,
    required: true
  },
  rating: Number, 
  comment: String,
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const Watched = mongoose.model('Watchedlist', watchedSchema);

module.exports = Watched;