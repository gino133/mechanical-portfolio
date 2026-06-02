const Contact = require('../models/Contact');

// @desc    Send contact message
// @route   POST /api/v1/contact/send
// @access  Public
const sendContact = async (req, res) => {
    const { name, email, phone, company, message, interestedIn } = req.body;
    
    const contact = await Contact.create({
        name,
        email,
        phone,
        company,
        message,
        interestedIn
    });
    
    res.status(201).json({
        success: true,
        message: 'Message sent successfully',
        data: contact
    });
};

// @desc    Get all contact messages
// @route   GET /api/v1/contact/messages
// @access  Private/Admin
const getMessages = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const startIndex = (page - 1) * limit;
    
    const messages = await Contact.find()
        .sort('-createdAt')
        .limit(limit)
        .skip(startIndex);
    
    const total = await Contact.countDocuments();
    
    res.json({
        success: true,
        data: messages,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    });
};

// @desc    Mark message as read
// @route   PUT /api/v1/contact/:id/read
// @access  Private/Admin
const markAsRead = async (req, res) => {
    const message = await Contact.findById(req.params.id);
    
    if (!message) {
        return res.status(404).json({
            success: false,
            message: 'Message not found'
        });
    }
    
    message.isRead = true;
    await message.save();
    
    res.json({
        success: true,
        data: message
    });
};

// @desc    Delete message
// @route   DELETE /api/v1/contact/:id
// @access  Private/Admin
const deleteMessage = async (req, res) => {
    const message = await Contact.findById(req.params.id);
    
    if (!message) {
        return res.status(404).json({
            success: false,
            message: 'Message not found'
        });
    }
    
    await message.deleteOne();
    
    res.json({
        success: true,
        message: 'Message deleted'
    });
};

module.exports = {
    sendContact,
    getMessages,
    markAsRead,
    deleteMessage
};