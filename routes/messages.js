const express = require('express');
const router = express.Router();
const Message = require('../models/message');
const User = require('../models/user');
const { ensureAuthenticated } = require('../config/auth');
const Notification = require('../models/notification');

// View messages (Inbox)
router.get('/inbox', ensureAuthenticated, async (req, res) => {
  try {
    const messages = await Message.find({ receiver: req.user._id }).populate('sender');
    res.render('inbox', { messages });
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

// Send a message
router.post('/send', ensureAuthenticated, async (req, res) => {
  const { receiverId, content } = req.body;
  try {
    const message = new Message({
      sender: req.user._id,
      receiver: receiverId,
      content
    });
    await message.save();

    const newNotification = new Notification({
        user: receiverId,
        message: `You have received a new message from ${req.user.username}`,
    });
    await newNotification.save();
    
    req.flash('success_msg', 'Message sent!');
    res.redirect(`/profile/${receiverId}`);
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Failed to send message');
    res.redirect('/inbox');
  }
});

module.exports = router;
