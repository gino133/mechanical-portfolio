const mongoose = require('mongoose');
const removeDiacritics = require('../utils/removeDiacritics');

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
        enum: ['pdf', 'dwg', 'dxf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'jpg', 'jpeg', 'png', 'gif'],
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
    // Cloudinary public_id (including resource_type context) - saved at
    // upload time so deletion is reliable instead of parsed from the URL.
    publicId: {
        type: String
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
    // Accent-stripped, lowercased copy of name, kept in sync via the
    // pre-save hook below.
    searchText: {
        type: String,
        default: ''
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

documentSchema.pre('save', function(next) {
    this.searchText = removeDiacritics(this.name);
    next();
});

// getDocuments() filters by category and/or searchText, and always sorts
// by -uploadedAt. Without these indexes Mongo does a full collection scan
// (+ in-memory sort) on every list request, which gets slower as the
// document count grows.
documentSchema.index({ uploadedAt: -1 });
documentSchema.index({ category: 1, uploadedAt: -1 });
documentSchema.index({ searchText: 1 });

module.exports = mongoose.model('Document', documentSchema);
