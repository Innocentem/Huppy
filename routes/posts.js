const express = require('express');
const Post = require('../models/post');
const isAuthenticated = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ dest: 'public/images/' }); // For image uploads
const router = express.Router();

// Display posts on landing page
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().populate('postedBy').exec();
        const token = req.cookies.token; // Assuming you're using cookies for the token
        res.render('index', { posts, token });
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).send('Error fetching posts');
    }
});

// Render new post form
router.get('/new', isAuthenticated, (req, res) => {
    res.render('post');
});

// Handle new post creation
router.post('/', isAuthenticated, upload.single('image'), async (req, res) => {
    const { description } = req.body;
    const imageUrl = `/images/${req.file.filename}`;

    // Basic validation
    if (!description || !req.file) {
        return res.status(400).send('Description and image are required');
    }

    try {
        const post = new Post({
            imageUrl,
            description,
            postedBy: req.userId
        });
        await post.save();
        res.redirect('/');
    } catch (err) {
        console.error('Error creating post:', err);
        res.status(500).send('Error creating post');
    }
});

// Handle post likes
router.post('/:id/like', isAuthenticated, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).send('Post not found');
        }
        if (!post.likes.includes(req.userId)) {
            post.likes.push(req.userId);
        }
        await post.save();
        res.redirect('/');
    } catch (err) {
        console.error('Error liking post:', err);
        res.status(500).send('Error liking post');
    }
});

// Handle post comments
router.post('/:id/comment', isAuthenticated, async (req, res) => {
    const { comment } = req.body;

    // Basic validation
    if (!comment) {
        return res.status(400).send('Comment cannot be empty');
    }

    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).send('Post not found');
        }
        post.comments.push({ text: comment, commentedBy: req.userId });
        await post.save();
        res.redirect('/');
    } catch (err) {
        console.error('Error commenting on post:', err);
        res.status(500).send('Error commenting on post');
    }
});

module.exports = router;
