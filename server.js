const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const cookieParser = require("cookie-parser"); // Add this
const passport = require('passport');
require('dotenv').config();
require('./config/passport'); // Passport configuration

const authRoutes = require('./routes/auth');
const sheetRoutes = require('./routes/sheets');

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_secret_key", // Store this in .env
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure only in production
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser())

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
