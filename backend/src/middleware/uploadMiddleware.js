const multer = require('multer');
const path = require('path');
const cloudinary = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif'];

// Configure Cloudinary storage
// FIX: resource_type: 'auto' let Cloudinary classify PDFs under its
// "image" delivery type (since Cloudinary can render PDF pages as
// images). Cloudinary's account-level security setting blocks public
// delivery of PDF/ZIP files uploaded that way by default, causing a 401
// error when opening the file URL. Non-image files (PDF, DWG, DXF, DOCX,
// XLSX...) are now uploaded as resource_type 'raw' instead, which isn't
// subject to that restriction and is the semantically correct type for
// documents anyway.
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
        const isImage = IMAGE_EXTENSIONS.includes(ext);
        return {
            folder: 'portfolio',
            resource_type: isImage ? 'image' : 'raw'
        };
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|dwg|dxf|docx|xlsx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only images, PDFs, DWG, and Office documents are allowed'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
    fileFilter: fileFilter
});

// For local upload (fallback if Cloudinary not configured)
const localStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const localUpload = multer({
    storage: localStorage,
    limits: { fileSize: 50 * 1024 * 1024 },
    fileFilter: fileFilter
});

module.exports = { upload, localUpload };
