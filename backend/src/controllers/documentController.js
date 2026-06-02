const Document = require('../models/Document');
const cloudinary = require('../config/cloudinary');

// @desc    Get all documents
// @route   GET /api/v1/documents
// @access  Public
const getDocuments = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const startIndex = (page - 1) * limit;
    const category = req.query.category;
    const search = req.query.search;

    let query = {};
    
    if (category && category !== 'all') {
        query.fileType = category;
    }
    
    if (search) {
        query.name = { $regex: search, $options: 'i' };
    }

    const documents = await Document.find(query)
        .populate('category', 'name')
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
};

// @desc    Get document by ID
// @route   GET /api/v1/documents/:id
// @access  Public
const getDocumentById = async (req, res) => {
    const document = await Document.findById(req.params.id)
        .populate('category', 'name')
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
};

// @desc    Download document (increment count)
// @route   GET /api/v1/documents/download/:id
// @access  Public
const downloadDocument = async (req, res) => {
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
};

// @desc    Upload document
// @route   POST /api/v1/documents/upload
// @access  Private/Admin
const uploadDocument = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: 'Please upload a file'
        });
    }

    const fileType = req.file.originalname.split('.').pop().toLowerCase();
    const fileSize = req.file.size;

    const document = await Document.create({
        name: req.body.name || req.file.originalname,
        fileName: req.file.originalname,
        fileType: fileType,
        fileSize: fileSize,
        fileUrl: req.file.path,
        category: req.body.category,
        relatedId: req.body.relatedId,
        relatedType: req.body.relatedType,
        version: req.body.version || '1.0'
    });

    res.status(201).json({
        success: true,
        data: document
    });
};

// @desc    Delete document
// @route   DELETE /api/v1/documents/:id
// @access  Private/Admin
const deleteDocument = async (req, res) => {
    const document = await Document.findById(req.params.id);

    if (!document) {
        return res.status(404).json({
            success: false,
            message: 'Document not found'
        });
    }

    // Delete from Cloudinary
    const publicId = document.fileUrl.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`portfolio/${publicId}`);

    await document.deleteOne();

    res.json({
        success: true,
        message: 'Document removed'
    });
};

module.exports = {
    getDocuments,
    getDocumentById,
    downloadDocument,
    uploadDocument,
    deleteDocument
};