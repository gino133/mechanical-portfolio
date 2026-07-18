const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    // Cloudinary public_id, needed to delete the file from storage later
    publicId: {
        type: String
    },
    fileName: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number
    },
    mimeType: {
        type: String
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Media', mediaSchema);
