const express = require('express');
const passport = require('passport');
const router = express.Router();

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.send('Login Successful');
  }
);

// Logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).send('Logout Failed');
    res.send('Logged out');
  });
});

// Get user profile
router.get('/profile', (req, res) => {
  if (!req.user) return res.status(401).send('Unauthorized');
  res.send(req.user);
});

module.exports = router;
