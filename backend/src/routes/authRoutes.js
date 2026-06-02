const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
    registerUser,
    loginUser,
    getMe,
    updateProfile
} = require('../controllers/authController');

router.post('/register', protect, admin, registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/update', protect, updateProfile);

module.exports = router;