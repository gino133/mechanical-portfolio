const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please add email'],
        lowercase: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    phone: {
        type: String,
        trim: true
    },
    company: {
        type: String,
        trim: true
    },
    message: {
        type: String,
        required: [true, 'Please add message']
    },
    interestedIn: {
        type: String,
        enum: ['product', 'project', 'service', 'other'],
        default: 'other'
    },
    isRead: {
        type: Boolean,
        default: false
    },
    repliedAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Contact', contactSchema);