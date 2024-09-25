const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user
  dogName: { type: String, required: true }, // Dog's name
  description: { type: String, required: true }, // Post description
  price: { type: Number, required: true }, // Dog's price
  image: { type: String, required: true }, // Image path
  isSold: { type: Boolean, default: false }, // Indicates if the dog is sold
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the user who commented
      text: { type: String, required: true }, // Comment text
      date: { type: Date, default: Date.now }, // Comment date
    },
  ],
  createdAt: { type: Date, default: Date.now }, // Post creation date
});

module.exports = mongoose.models.Post || mongoose.model('Post', PostSchema);
