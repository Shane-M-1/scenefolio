const mongoose = require('mongoose');

const watchedSchema = new mongoose.Schema({
  mID: {
    type: String,
    required: true
  },
  rating: Number, 
  comment: String,
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const Watchedlist = mongoose.model('Watchedlist', watchedSchema);

module.exports = Watchedlist;