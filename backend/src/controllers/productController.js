const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
const getProducts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const startIndex = (page - 1) * limit;
    const category = req.query.category;
    const search = req.query.search;

    let query = {};
    
    if (category && category !== 'all') {
        const categoryDoc = await Category.findOne({ name: category, type: 'product' });
        if (categoryDoc) {
            query.category = categoryDoc._id;
        }
    }
    
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { code: { $regex: search, $options: 'i' } }
        ];
    }

    const products = await Product.find(query)
        .populate('category', 'name slug')
        .sort('-createdAt')
        .limit(limit)
        .skip(startIndex);

    const total = await Product.countDocuments(query);

    res.json({
        success: true,
        data: products,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    });
};

// @desc    Get featured products
// @route   GET /api/v1/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
    const products = await Product.find({ isFeatured: true })
        .populate('category', 'name slug')
        .limit(6)
        .sort('-createdAt');

    res.json({
        success: true,
        data: products
    });
};

// @desc    Get single product
// @route   GET /api/v1/products/:id
// @access  Public
const getProductById = async (req, res) => {
    const product = await Product.findById(req.params.id)
        .populate('category', 'name slug')
        .populate('documents');

    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        });
    }

    // Increment view count
    product.viewCount += 1;
    await product.save();

    res.json({
        success: true,
        data: product
    });
};

// @desc    Create product
// @route   POST /api/v1/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        data: product
    });
};

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    res.json({
        success: true,
        data: updatedProduct
    });
};

// @desc    Delete product
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        });
    }

    await product.deleteOne();

    res.json({
        success: true,
        message: 'Product removed'
    });
};

module.exports = {
    getProducts,
    getFeaturedProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};