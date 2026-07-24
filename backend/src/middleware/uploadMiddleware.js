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
        const ext = path.extname(file.originalname).toLowerCase(); // e.g. '.docx', includes the dot
        const extNoDot = ext.replace('.', '');
        const isImage = IMAGE_EXTENSIONS.includes(extNoDot);

        if (isImage) {
            return {
                folder: 'portfolio',
                resource_type: 'image'
            };
        }

        // FIX: for resource_type 'raw', Cloudinary uses the public_id as
        // the literal delivered filename - it does NOT append the
        // extension separately the way it does for images. Without the
        // extension baked into public_id here, uploaded documents (docx,
        // dwg, xlsx...) lost their file extension entirely, so downloaded
        // files couldn't be opened by Word/AutoCAD/Excel.
        const baseName = path.basename(file.originalname, ext)
            .replace(/[^a-zA-Z0-9_-]/g, '_')
            .substring(0, 80);
        const uniqueSuffix = Date.now();

        return {
            folder: 'portfolio',
            resource_type: 'raw',
            public_id: `${baseName}-${uniqueSuffix}${ext}`
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
