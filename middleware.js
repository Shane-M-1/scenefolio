const isLoggedIn = (req, res, next) => {
  if (req.session.user_id) {
    next();
  } else {
    req.flash('error', 'Login or create an account to create a wishlist/watchedlist!');
    res.redirect('/users/login');
  }
}

module.exports = isLoggedIn;