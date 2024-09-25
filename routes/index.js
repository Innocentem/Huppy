const express = require('express');
const router = express.Router();
const Post = require('../models/post');  // MongoDB Post model
const { ensureAuthenticated } = require('../config/auth'); // Authentication middleware

// Landing page
router.get('/', (req, res) => {
  res.render('index', { user: req.user }); // Render landing page with user (if logged in)
});

// Main page (display all posts)
router.get('/main', ensureAuthenticated, async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.render('main', { posts, user: req.user }); // Pass both posts and user to the view
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

// Profile page
router.get('/profile', ensureAuthenticated, (req, res) => {
  res.render('profile', { user: req.user }); // Render profile page with user info
});

module.exports = router;
