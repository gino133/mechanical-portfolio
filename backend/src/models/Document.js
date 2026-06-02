const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add document name'],
        trim: true
    },
    fileName: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        enum: ['pdf', 'dwg', 'dxf', 'docx', 'xlsx', 'jpg', 'png'],
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    relatedId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'relatedType'
    },
    relatedType: {
        type: String,
        enum: ['Product', 'Project']
    },
    version: {
        type: String,
        default: '1.0'
    },
    downloadCount: {
        type: Number,
        default: 0
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Document', documentSchema);