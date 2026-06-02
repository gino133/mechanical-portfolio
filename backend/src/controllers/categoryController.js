const Category = require('../models/Category');

// @desc    Get all categories
// @route   GET /api/v1/categories
// @access  Public
const getCategories = async (req, res) => {
    const categories = await Category.find().sort('order');
    
    res.json({
        success: true,
        data: categories
    });
};

// @desc    Get categories by type
// @route   GET /api/v1/categories/:type
// @access  Public
const getCategoriesByType = async (req, res) => {
    const categories = await Category.find({ type: req.params.type }).sort('order');
    
    res.json({
        success: true,
        data: categories
    });
};

// @desc    Create category
// @route   POST /api/v1/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
    const { name, slug, type, description, order } = req.body;
    
    const category = await Category.create({
        name,
        slug,
        type,
        description,
        order
    });
    
    res.status(201).json({
        success: true,
        data: category
    });
};

// @desc    Update category
// @route   PUT /api/v1/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );
    
    if (!category) {
        return res.status(404).json({
            success: false,
            message: 'Category not found'
        });
    }
    
    res.json({
        success: true,
        data: category
    });
};

// @desc    Delete category
// @route   DELETE /api/v1/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
        return res.status(404).json({
            success: false,
            message: 'Category not found'
        });
    }
    
    await category.deleteOne();
    
    res.json({
        success: true,
        message: 'Category removed'
    });
};

module.exports = {
    getCategories,
    getCategoriesByType,
    createCategory,
    updateCategory,
    deleteCategory
};