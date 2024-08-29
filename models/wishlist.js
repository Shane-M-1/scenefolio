const mongoose = require('mongoose');

const wishSchema = new mongoose.Schema({
  mID: {
    type: Number,
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const Wish = mongoose.model('Wish', wishSchema);

module.exports = Wish;