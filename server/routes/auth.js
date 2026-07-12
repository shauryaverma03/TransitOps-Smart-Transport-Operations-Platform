const express = require('express');
const router = express.Router();
const { login, getMe } = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/login', login);
router.get('/me', auth, getMe);
// Logout is typically handled on the client side by removing the JWT

module.exports = router;
