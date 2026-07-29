const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');
const {
    getDocuments,
    getDocumentsAdmin,
    getDocumentById,
    downloadDocument,
    uploadDocument,
    updateDocument,
    bulkUpdateDocuments,
    bulkDeleteDocuments,
    deleteDocument
} = require('../controllers/documentController');

router.route('/')
    .get(getDocuments)
    .post(protect, admin, upload.single('file'), uploadDocument);

// Must be registered before '/:id' or Express would treat these as an id
router.get('/admin', protect, admin, getDocumentsAdmin);
router.put('/bulk', protect, admin, bulkUpdateDocuments);
router.post('/bulk-delete', protect, admin, bulkDeleteDocuments);

router.get('/download/:id', downloadDocument);

router.route('/:id')
    .get(getDocumentById)
    .put(protect, admin, updateDocument)
    .delete(protect, admin, deleteDocument);

module.exports = router;
