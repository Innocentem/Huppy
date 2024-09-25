const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const { ensureAuthenticated } = require('../config/auth');

// Create a new post
router.post('/new', ensureAuthenticated, async (req, res) => {
  const { dogName, description, price } = req.body;
  const image = req.file.path; // Assuming image upload is handled elsewhere
  try {
    const newPost = new Post({
      owner: req.user._id,
      dogName,
      description,
      price,
      image
    });
    await newPost.save();
    req.flash('success_msg', 'Dog posted successfully');
    res.redirect('/profile');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Failed to post');
    res.redirect('/profile');
  }
});

// Delete a post
router.post('/:id/delete', ensureAuthenticated, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.owner.toString() === req.user._id.toString()) {
      await Post.deleteOne({ _id: req.params.id });
      req.flash('success_msg', 'Post deleted successfully');
    } else {
      req.flash('error_msg', 'Unauthorized to delete this post');
    }
    res.redirect('/profile');
  } catch (error) {
    console.error(error);
    res.redirect('/profile');
  }
});

// Mark a post as sold
router.post('/:id/mark-sold', ensureAuthenticated, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.owner.toString() === req.user._id.toString()) {
      post.isSold = true;
      await post.save();
      req.flash('success_msg', 'Post marked as sold');
    } else {
      req.flash('error_msg', 'Unauthorized to mark this post as sold');
    }
    res.redirect('/profile');
  } catch (error) {
    console.error(error);
    res.redirect('/profile');
  }
});

router.post('/:id/like', ensureAuthenticated, async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post.likes.includes(req.user._id)) {
        post.likes.push(req.user._id);
        await post.save();
        
        // Send notification to the post owner
        const newNotification = new Notification({
          user: post.owner,
          message: `${req.user.username} liked your post: ${post.dogName}`
        });
        await newNotification.save();
      }
      res.redirect('/');
    } catch (error) {
      console.error(error);
      res.redirect('/');
    }
  });


  router.post('/:id/comment', ensureAuthenticated, async (req, res) => {
    const { comment } = req.body;
    try {
      const post = await Post.findById(req.params.id);
      post.comments.push({ user: req.user._id, content: comment });
      await post.save();
  
      // Notify the post owner
      const newNotification = new Notification({
        user: post.owner,
        message: `${req.user.username} commented on your post: ${post.dogName}`
      });
      await newNotification.save();
  
      res.redirect(`/posts/${post._id}`);
    } catch (error) {
      console.error(error);
      res.redirect('/');
    }
  });  

module.exports = router;
