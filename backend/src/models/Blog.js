const mongoose = require('mongoose');
const removeDiacritics = require('../utils/removeDiacritics');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    excerpt: {
        type: String,
        default: ''
    },
    content: {
        type: String,
        required: [true, 'Please add content']
    },
    coverImage: {
        type: String,
        default: ''
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    author: {
        type: String,
        default: ''
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    viewCount: {
        type: Number,
        default: 0
    },
    // Accent-stripped, lowercased copy of title + excerpt, kept in sync via
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

blogSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    this.searchText = removeDiacritics(`${this.title} ${this.excerpt}`);
    next();
});

module.exports = mongoose.model('Blog', blogSchema);
