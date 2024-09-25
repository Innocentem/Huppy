const mongoose = require('mongoose');

// Define the User Schema
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,  // Ensure each username is unique
  },
  email: {
    type: String,
    required: true,
    unique: true,  // Ensure each email is unique
  },
  password: {
    type: String,
    required: true, // Hashed password stored here
  },
  profileImage: {
    type: String, // Path or URL to the user's profile picture
    default: '/images/default-profile.png', // Default profile image if none is uploaded
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post' // Reference to the Post model
  }],
  createdAt: {
    type: Date,
    default: Date.now // When the user was created
  }
});

module.exports = mongoose.model('User', UserSchema);
