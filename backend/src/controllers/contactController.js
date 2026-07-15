const Contact = require('../models/Contact');
const { sendContactNotification, sendAutoReplyToCustomer } = require('../config/email');

// @desc    Send contact message
// @route   POST /api/v1/contact/send
// @access  Public
const sendContact = async (req, res) => {
    const { name, email, phone, company, message, interestedIn } = req.body;

    try {
        const contact = await Contact.create({
            name,
            email,
            phone,
            company,
            message,
            interestedIn
        });

        // FIX: email sending is best-effort and must not turn an already-saved
        // message into a false "failed" response for the visitor. If
        // EMAIL_USER/EMAIL_PASS aren't configured, this used to throw and the
        // outer catch returned 500 even though the message was saved fine.
        try {
            await sendContactNotification(contact);
            // await sendAutoReplyToCustomer(contact);
        } catch (emailError) {
            console.error('Contact saved, but notification email failed:', emailError.message);
        }

        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data: contact
        });
    } catch (error) {
        console.error('Error sending contact:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message'
        });
    }
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
