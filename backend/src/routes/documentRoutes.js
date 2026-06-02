const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');
const {
    getDocuments,
    getDocumentById,
    downloadDocument,
    uploadDocument,
    deleteDocument
} = require('../controllers/documentController');

router.route('/')
    .get(getDocuments)
    .post(protect, admin, upload.single('file'), uploadDocument);

router.get('/download/:id', downloadDocument);

router.route('/:id')
    .get(getDocumentById)
    .delete(protect, admin, deleteDocument);

module.exports = router;