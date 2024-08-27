const mongoose = require('mongoose');

const wishSchema = new mongoose.Schema({
  mID: {
    type: String,
    required: true
  }
});

const Wishlist = mongoose.model('Wishlist', wishSchema);

module.exports = Wishlist;