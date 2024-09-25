const express = require('express');
const router = express.Router();
const Notification = require('../models/notification');
const { ensureAuthenticated } = require('../config/auth');

// View notifications
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id, isRead: false });
    res.render('notifications', { notifications });
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

// Mark notification as read
router.post('/:id/read', ensureAuthenticated, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.redirect('/notifications');
  } catch (error) {
    console.error(error);
    res.redirect('/notifications');
  }
});

module.exports = router;
