const User = require('../models/User');

// @desc    Create or reset the admin account via a protected URL
// @route   GET /api/v1/setup/create-admin?key=YOUR_SETUP_SECRET
// @access  Public, but requires a matching ?key= query param
//
// SECURITY: this route must be deleted (or SETUP_SECRET removed from env)
// as soon as you've confirmed the admin account works. Anyone who guesses
// or leaks SETUP_SECRET can create/overwrite the admin account while this
// route exists.
const createAdminViaUrl = async (req, res) => {
    try {
        const { key } = req.query;

        if (!process.env.SETUP_SECRET) {
            return res.status(500).json({
                success: false,
                message: 'SETUP_SECRET is not configured on the server. Add it in your hosting dashboard env vars first.'
            });
        }

        if (!key || key !== process.env.SETUP_SECRET) {
            return res.status(403).json({
                success: false,
                message: 'Forbidden: missing or incorrect key'
            });
        }

        if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
            return res.status(500).json({
                success: false,
                message: 'ADMIN_EMAIL / ADMIN_PASSWORD is not configured on the server.'
            });
        }

        const existing = await User.findOne({ email: process.env.ADMIN_EMAIL }).select('+password');

        if (existing) {
            existing.password = process.env.ADMIN_PASSWORD; // pre-save hook re-hashes it
            existing.role = 'admin';
            await existing.save();

            return res.json({
                success: true,
                message: `Admin password reset for ${existing.email}. Remove this route now.`
            });
        }

        const admin = await User.create({
            name: 'Admin',
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD,
            role: 'admin'
        });

        return res.json({
            success: true,
            message: `Admin created: ${admin.email}. Remove this route now.`
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { createAdminViaUrl };
