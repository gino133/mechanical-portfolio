const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');
const { uploadMedia, getMedia, deleteMedia } = require('../controllers/mediaController');

router.route('/')
    .get(protect, admin, getMedia);

router.post('/upload', protect, admin, upload.single('image'), uploadMedia);

router.delete('/:id', protect, admin, deleteMedia);

module.exports = router;
