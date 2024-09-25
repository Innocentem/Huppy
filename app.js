const express = require('express');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const app = express();

// Passport config
require('./config/passport')(passport);

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/huppy', { useNewUrlParser: true, useUnifiedTopology: true });

// Bodyparser
app.use(express.urlencoded({ extended: false }));

// Express session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

// Set static folder
app.use(express.static('public'));

// EJS
app.set('view engine', 'ejs');

app.listen(3000, () => {
  console.log('Server started on http://127.0.0.1:3000');
});
