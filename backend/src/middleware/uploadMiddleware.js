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
// FIX: the old check required BOTH extension AND mimetype to match the
// same regex - but Office files report long, unrelated MIME strings (e.g.
// .docx is "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
// which doesn't contain "docx" anywhere), so real Word/Excel/PowerPoint
// files always failed the mimetype half of the check and got rejected.
// Browsers are also inconsistent about MIME types for CAD files (.dwg/.dxf
// often show up as "application/octet-stream"). Checking the file
// extension alone is more reliable here and is standard practice for
// document upload validation.
const allowedExtensions = /\.(jpe?g|png|gif|pdf|dwg|dxf|docx?|xlsx?|pptx?)$/i;

const fileFilter = (req, file, cb) => {
    if (allowedExtensions.test(file.originalname)) {
        return cb(null, true);
    }
    cb(new Error('Only images, PDF, DWG/DXF, and Microsoft Office documents (Word, Excel, PowerPoint) are allowed'));
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
