const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
    getCategories,
    getCategoriesByType,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');

router.route('/')
    .get(getCategories)
    .post(protect, admin, createCategory);

router.get('/type/:type', getCategoriesByType);

router.route('/:id')
    .put(protect, admin, updateCategory)
    .delete(protect, admin, deleteCategory);

module.exports = router;