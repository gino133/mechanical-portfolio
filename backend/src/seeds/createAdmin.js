const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Safe alternative to seed.js: only creates or updates the admin account,
// never touches categories/products/projects/other users.
// Usage: node src/seeds/createAdmin.js   (run from anywhere, path is fixed)
const createAdmin = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is undefined - check that backend/.env exists and has this key');
        }
        if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
            throw new Error('ADMIN_EMAIL / ADMIN_PASSWORD is undefined - check backend/.env');
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const existing = await User.findOne({ email: process.env.ADMIN_EMAIL }).select('+password');

        if (existing) {
            console.log('Admin already exists, updating password...');
            existing.password = process.env.ADMIN_PASSWORD; // pre-save hook will re-hash it
            existing.role = 'admin';
            await existing.save();
            console.log('Admin password updated');
        } else {
            await User.create({
                name: 'Admin',
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD,
                role: 'admin'
            });
            console.log('Admin created');
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

createAdmin();
