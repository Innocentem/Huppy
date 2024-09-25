const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/user'); // MongoDB User model

// Register page
router.get('/register', (req, res) => {
  res.render('register', { errors: [] });
});

// Register handler
router.post('/register', async (req, res) => {
  const { username, email, password, password2 } = req.body;
  let errors = [];

  // Check for password matching and length
  if (password !== password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    return res.render('register', { errors, username, email, password, password2 });
  }

  try {
    const user = await User.findOne({ email });

    if (user) {
      errors.push({ msg: 'Email already registered' });
      return res.render('register', { errors, username, email, password, password2 });
    }

    // Create new user
    const newUser = new User({
      username,
      email,
      password,
    });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);
    await newUser.save();

    // Set success message and redirect to login
    req.flash('success_msg', 'You are now registered and can log in');
    return res.redirect('/users/login');
  } catch (error) {
    console.error(error);
    return res.render('register', { errors: [{ msg: 'Error occurred during registration' }], username, email });
  }
});

// Login page
router.get('/login', (req, res) => {
  res.render('login');
});

// Login handler
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/main',
    failureRedirect: '/users/login',
    failureFlash: true,
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;
