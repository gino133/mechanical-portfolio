const mongoose = require('mongoose');

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
    completionDate: {
        type: Date
    },
    viewCount: {
        type: Number,
        default: 0
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
    next();
});

module.exports = mongoose.model('Project', projectSchema);