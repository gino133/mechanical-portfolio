const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const projectRoutes = require('./projectRoutes');
const documentRoutes = require('./documentRoutes');
const categoryRoutes = require('./categoryRoutes');
const contactRoutes = require('./contactRoutes');

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/projects', projectRoutes);
router.use('/documents', documentRoutes);
router.use('/categories', categoryRoutes);
router.use('/contact', contactRoutes);

module.exports = router;