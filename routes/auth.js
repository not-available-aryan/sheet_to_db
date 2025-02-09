const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken')
require ('dotenv').config();
const router = express.Router();

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication failed" });
    }
    const token = jwt.sign(
      { userId: req.user._id, email: req.user.email }, // Payload
      process.env.JWT_SECRET, // Secret key
      { expiresIn: "1h" } // Expiration time
    );
    res.cookie('token', token, { httpOnly: true, secure: true });
    res.json({ message: "Login Successful" });
    }
);

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie("jwt"); // Remove JWT cookie
  res.json({ message: "Logged out successfully" });
});

// Get user profile
router.get('/profile', (req, res) => {
  if (!req.user) return res.status(401).send('Unauthorized');
  res.send(req.user);
});

module.exports = router;
