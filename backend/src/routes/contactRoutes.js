const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
    sendContact,
    getMessages,
    markAsRead,
    deleteMessage
} = require('../controllers/contactController');

router.post('/send', sendContact);
router.get('/messages', protect, admin, getMessages);
router.put('/:id/read', protect, admin, markAsRead);
router.delete('/:id', protect, admin, deleteMessage);

module.exports = router;