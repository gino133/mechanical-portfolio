const express = require('express');
const router = express.Router();
const { protect, admin, optionalAuth } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');
const {
    getDocuments,
    getDocumentById,
    downloadDocument,
    uploadDocument,
    updateDocument,
    deleteDocument,
    bulkUpdateDocuments
} = require('../controllers/documentController');

router.route('/')
    .get(optionalAuth, getDocuments)
    .post(protect, admin, upload.single('file'), uploadDocument);

router.get('/download/:id', downloadDocument);

router.patch('/bulk', protect, admin, bulkUpdateDocuments);

router.route('/:id')
    .get(getDocumentById)
    .put(protect, admin, updateDocument)
    .delete(protect, admin, deleteDocument);

module.exports = router;
