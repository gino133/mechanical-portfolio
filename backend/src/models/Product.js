const mongoose = require('mongoose');
const removeDiacritics = require('../utils/removeDiacritics');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add product name'],
        trim: true
    },
    code: {
        type: String,
        required: [true, 'Please add product code'],
        unique: true,
        trim: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    images: [{
        type: String,
        required: true
    }],
    thumbnail: {
        type: String,
        required: true
    },
    specifications: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    description: {
        type: String,
        required: [true, 'Please add description']
    },
    documents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document'
    }],
    isFeatured: {
        type: Boolean,
        default: false
    },
    viewCount: {
        type: Number,
        default: 0
    },
    // Accent-stripped, lowercased copy of name + code, kept in sync via the
    // pre-save hook below - lets search match "may ep" against "Máy ép".
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

productSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    this.searchText = removeDiacritics(`${this.name} ${this.code}`);
    next();
});

module.exports = mongoose.model('Product', productSchema);
