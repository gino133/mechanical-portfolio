const Media = require('../models/Media');
const cloudinary = require('../config/cloudinary');

// @desc    Upload a new image to the media library
// @route   POST /api/v1/media/upload
// @access  Private/Admin
const uploadMedia = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: 'Please select an image to upload'
        });
    }

    try {
        const media = await Media.create({
            url: req.file.path,
            publicId: req.file.filename, // set by multer-storage-cloudinary
            fileName: req.body.name ? req.body.name.trim() : req.file.originalname,
            fileSize: req.file.size,
            mimeType: req.file.mimetype
        });

        res.status(201).json({
            success: true,
            data: media
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all uploaded images (most recent first)
// @route   GET /api/v1/media
// @access  Private/Admin
const getMedia = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 60;
    const startIndex = (page - 1) * limit;

    const media = await Media.find()
        .sort('-uploadedAt')
        .limit(limit)
        .skip(startIndex);

    const total = await Media.countDocuments();

    res.json({
        success: true,
        data: media,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    });
};

// @desc    Delete an image from the media library
// @route   DELETE /api/v1/media/:id
// @access  Private/Admin
const deleteMedia = async (req, res) => {
    const media = await Media.findById(req.params.id);

    if (!media) {
        return res.status(404).json({
            success: false,
            message: 'Image not found'
        });
    }

    if (media.publicId) {
        try {
            await cloudinary.uploader.destroy(media.publicId);
        } catch (error) {
            console.error('Cloudinary delete failed (record will still be removed):', error.message);
        }
    }

    await media.deleteOne();

    res.json({
        success: true,
        message: 'Image removed'
    });
};

module.exports = {
    uploadMedia,
    getMedia,
    deleteMedia
};
