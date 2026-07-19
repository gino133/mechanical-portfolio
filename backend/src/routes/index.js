const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const projectRoutes = require('./projectRoutes');
const documentRoutes = require('./documentRoutes');
const categoryRoutes = require('./categoryRoutes');
const contactRoutes = require('./contactRoutes');
const settingsRoutes = require('./settingsRoutes');
const mediaRoutes = require('./mediaRoutes');
const blogRoutes = require('./blogRoutes');
const setupRoutes = require('./setupRoutes'); // TEMPORARY - remove after creating admin

// Friendly response for the bare "/api/v1" path itself (it's just a prefix
// for the routes below, not a resource on its own - previously this 404'd,
// which confused uptime/flow-checking tools even though it was harmless).
router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Mechanical Portfolio API v1',
        endpoints: [
            '/auth', '/products', '/projects', '/documents',
            '/categories', '/contact', '/settings', '/media', '/blog'
        ]
    });
});

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/projects', projectRoutes);
router.use('/documents', documentRoutes);
router.use('/categories', categoryRoutes);
router.use('/contact', contactRoutes);
router.use('/settings', settingsRoutes);
router.use('/media', mediaRoutes);
router.use('/blog', blogRoutes);
router.use('/setup', setupRoutes); // TEMPORARY - remove after creating admin

module.exports = router;
