const mongoose = require('mongoose');
const removeDiacritics = require('../utils/removeDiacritics');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add project name'],
        trim: true
    },
    client: {
        type: String,
        required: [true, 'Please add client name'],
        trim: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    gallery: [{
        type: String
    }],
    description: {
        type: String,
        required: [true, 'Please add description']
    },
    technicalInfo: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    documents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document'
    }],
    isCompleted: {
        type: Boolean,
        default: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    completionDate: {
        type: Date
    },
    viewCount: {
        type: Number,
        default: 0
    },
    // Accent-stripped, lowercased copy of name + client, kept in sync via
    // the pre-save hook below.
    searchText: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

projectSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    this.searchText = removeDiacritics(`${this.name} ${this.client}`);
    next();
});

// Matches projectController's list query (category filter + isFeatured
// filter, sorted by -year -createdAt) and search filter.
projectSchema.index({ category: 1, year: -1, createdAt: -1 });
projectSchema.index({ isFeatured: 1, createdAt: -1 });
projectSchema.index({ searchText: 1 });

module.exports = mongoose.model('Project', projectSchema);
