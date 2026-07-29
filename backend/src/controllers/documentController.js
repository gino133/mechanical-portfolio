const Document = require('../models/Document');
const cloudinary = require('../config/cloudinary');
const removeDiacritics = require('../utils/removeDiacritics');

// @desc    Get all documents (public - only visible ones)
// @route   GET /api/v1/documents
// @access  Public
const getDocuments = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const startIndex = (page - 1) * limit;
        const category = req.query.category;
        const search = req.query.search;

        // $ne: false also matches documents saved before isVisible existed
        // (undefined), so old records don't disappear from the public site.
        let query = { isVisible: { $ne: false } };

        if (category && category !== 'all') {
            query.category = category;
        }

        if (search) {
            // Diacritic-insensitive.
            query.searchText = { $regex: removeDiacritics(search), $options: 'i' };
        }

        const documents = await Document.find(query)
            .populate('category', 'name slug')
            .sort('-uploadedAt')
            .limit(limit)
            .skip(startIndex);

        const total = await Document.countDocuments(query);

        res.json({
            success: true,
            data: documents,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('getDocuments error:', error);
        res.status(500).json({ success: false, message: 'Failed to load documents' });
    }
};

// @desc    Get all documents including hidden ones (admin)
// @route   GET /api/v1/documents/admin
// @access  Private/Admin
const getDocumentsAdmin = async (req, res) => {
    try {
        const documents = await Document.find()
            .populate('category', 'name slug')
            .sort('-uploadedAt');

        res.json({ success: true, data: documents });
    } catch (error) {
        console.error('getDocumentsAdmin error:', error);
        res.status(500).json({ success: false, message: 'Failed to load documents' });
    }
};

// @desc    Get document by ID
// @route   GET /api/v1/documents/:id
// @access  Public
const getDocumentById = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id)
            .populate('category', 'name slug')
            .populate('relatedId');

        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'Document not found'
            });
        }

        res.json({
            success: true,
            data: document
        });
    } catch (error) {
        console.error('getDocumentById error:', error);
        res.status(500).json({ success: false, message: 'Failed to load document' });
    }
};

// @desc    Download document (increment count)
// @route   GET /api/v1/documents/download/:id
// @access  Public
const downloadDocument = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'Document not found'
            });
        }

        // Increment download count
        document.downloadCount += 1;
        await document.save();

        res.json({
            success: true,
            data: {
                url: document.fileUrl,
                name: document.name,
                fileName: document.fileName
            }
        });
    } catch (error) {
        console.error('downloadDocument error:', error);
        res.status(500).json({ success: false, message: 'Failed to prepare download' });
    }
};

// @desc    Upload document
// @route   POST /api/v1/documents
// @access  Private/Admin
const uploadDocument = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: 'Please upload a file'
        });
    }

    try {
        const fileType = req.file.originalname.split('.').pop().toLowerCase();
        const fileSize = req.file.size;

        const document = await Document.create({
            name: req.body.name || req.file.originalname,
            fileName: req.file.originalname,
            fileType: fileType,
            fileSize: fileSize,
            fileUrl: req.file.path,
            // multer-storage-cloudinary sets req.file.filename to the actual
            // public_id used on Cloudinary - save it so deletion is reliable.
            publicId: req.file.filename,
            category: req.body.category || undefined,
            relatedId: req.body.relatedId || undefined,
            relatedType: req.body.relatedType || undefined,
            version: req.body.version || '1.0'
        });

        res.status(201).json({
            success: true,
            data: document
        });
    } catch (error) {
        console.error('uploadDocument error:', error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update document metadata (name, category, isVisible) - does not replace the file
// @route   PUT /api/v1/documents/:id
// @access  Private/Admin
const updateDocument = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'Document not found'
            });
        }

        if (req.body.name !== undefined) document.name = req.body.name;
        if (req.body.category !== undefined) document.category = req.body.category || undefined;
        if (req.body.isVisible !== undefined) document.isVisible = req.body.isVisible;

        // searchText is recomputed by the pre-save hook since we use
        // document.save() here (unlike findByIdAndUpdate elsewhere).
        await document.save();
        await document.populate('category', 'name slug');

        res.json({
            success: true,
            data: document
        });
    } catch (error) {
        console.error('updateDocument error:', error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Bulk update documents (hide/show and/or change category for many at once)
// @route   PUT /api/v1/documents/bulk
// @access  Private/Admin
const bulkUpdateDocuments = async (req, res) => {
    try {
        const { ids, updates } = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ success: false, message: 'No documents selected' });
        }

        const allowedUpdates = {};
        if (updates?.isVisible !== undefined) allowedUpdates.isVisible = updates.isVisible;
        if (updates?.category !== undefined) allowedUpdates.category = updates.category || undefined;

        if (Object.keys(allowedUpdates).length === 0) {
            return res.status(400).json({ success: false, message: 'No valid updates provided' });
        }

        // Use individual saves (not updateMany) so the pre-save hook still
        // runs for any field that affects searchText.
        const documents = await Document.find({ _id: { $in: ids } });
        for (const doc of documents) {
            Object.assign(doc, allowedUpdates);
            await doc.save();
        }

        res.json({ success: true, message: `Updated ${documents.length} documents` });
    } catch (error) {
        console.error('bulkUpdateDocuments error:', error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Bulk delete documents
// @route   POST /api/v1/documents/bulk-delete
// @access  Private/Admin
const bulkDeleteDocuments = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ success: false, message: 'No documents selected' });
        }

        const documents = await Document.find({ _id: { $in: ids } });

        for (const document of documents) {
            const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes((document.fileType || '').toLowerCase());
            const publicId = document.publicId || `portfolio/${document.fileUrl.split('/').pop().split('.')[0]}`;
            try {
                await cloudinary.uploader.destroy(publicId, {
                    resource_type: isImage ? 'image' : 'raw'
                });
            } catch (error) {
                console.error(`Cloudinary delete failed for ${document._id} (record will still be removed):`, error.message);
            }
        }

        await Document.deleteMany({ _id: { $in: ids } });

        res.json({ success: true, message: `Deleted ${documents.length} documents` });
    } catch (error) {
        console.error('bulkDeleteDocuments error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete documents' });
    }
};

// @desc    Delete document
// @route   DELETE /api/v1/documents/:id
// @access  Private/Admin
const deleteDocument = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'Document not found'
            });
        }

        // Delete from Cloudinary
        // Non-image documents (pdf/dwg/docx/xlsx...) are uploaded as
        // resource_type 'raw'. destroy() defaults to resource_type 'image'
        // when not specified, which silently fails to remove raw files.
        const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes((document.fileType || '').toLowerCase());
        const publicId = document.publicId || `portfolio/${document.fileUrl.split('/').pop().split('.')[0]}`;
        try {
            await cloudinary.uploader.destroy(publicId, {
                resource_type: isImage ? 'image' : 'raw'
            });
        } catch (error) {
            console.error('Cloudinary delete failed (record will still be removed):', error.message);
        }

        await document.deleteOne();

        res.json({
            success: true,
            message: 'Document removed'
        });
    } catch (error) {
        console.error('deleteDocument error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete document' });
    }
};

module.exports = {
    getDocuments,
    getDocumentsAdmin,
    getDocumentById,
    downloadDocument,
    uploadDocument,
    updateDocument,
    bulkUpdateDocuments,
    bulkDeleteDocuments,
    deleteDocument
};
