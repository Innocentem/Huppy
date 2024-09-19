const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    passwordHash: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ }, // Email format validation
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
});

// Pre-save hook for password hashing
userSchema.pre('save', async function(next) {
    if (this.isModified('passwordHash')) { // Check for passwordHash instead
        this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
        this.password = undefined; // Remove plain-text password field after hashing
    }
    next();
});

// Custom method to set the password
userSchema.methods.setPassword = async function(password) {
    this.passwordHash = await bcrypt.hash(password, 10);
};

// Custom method to validate the password
userSchema.methods.isValidPassword = async function(password) {
    return await bcrypt.compare(password, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);
