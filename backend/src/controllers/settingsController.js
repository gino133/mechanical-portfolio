const Settings = require('../models/Settings');

// @desc    Get site settings (creates default doc on first call)
// @route   GET /api/v1/settings
// @access  Public
const getSettings = async (req, res) => {
    try {
        const settings = await Settings.getSingleton();
        res.json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update site settings
// @route   PUT /api/v1/settings
// @access  Private/Admin
const updateSettings = async (req, res) => {
    try {
        const existing = await Settings.getSingleton();

        // Never let the client overwrite _id/timestamps directly
        const { _id, createdAt, updatedAt, __v, ...updates } = req.body;

        Object.assign(existing, updates);
        await existing.save();

        res.json({ success: true, data: existing });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = { getSettings, updateSettings };
