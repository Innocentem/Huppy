const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Render home page (index.ejs) with embedded signup form
router.get('/signup', (req, res) => {
    res.redirect('/#signup-section'); // Redirect to the signup section within the same page
});

// Handle sign-up request (post from the embedded form in index.ejs)
router.post('/signup', async (req, res) => {
    const { username, password, email } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('index', { 
                error: 'User already exists', 
                token: null // Ensure 'token' is passed correctly, null if not authenticated
            }); // Render index with error message on the signup section
        }

        const user = new User({ username, email });
        await user.setPassword(password);
        await user.save();
        res.redirect('/auth/login');  // Redirect to login after signup
    } catch (err) {
        console.error('Error creating user:', err);
        res.render('index', { 
            error: 'Error creating user', 
            token: null // Ensure 'token' is passed correctly, null if not authenticated
        }); // Render index with error message
    }
});

// Render login page
router.get('/login', (req, res) => {
    res.render('login', { error: null }); // Render login page with no errors
});

// Handle login request
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !await user.isValidPassword(password)) {
            return res.render('login', { error: 'Invalid Credentials' }); // Pass error message
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'defaultSecretKey', { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/');  // Redirect to home page after login
    } catch (err) {
        console.error('Error logging in:', err);
        res.render('login', { error: 'Error logging in' }); // Pass error message
    }
});

module.exports = router;
