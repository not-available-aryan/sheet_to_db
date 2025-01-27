const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();
require('./config/passport'); // Passport configuration

const authRoutes = require('./routes/auth');
const sheetRoutes = require('./routes/sheets');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Routes
app.use('/auth', authRoutes);
app.use('/sheets', sheetRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
