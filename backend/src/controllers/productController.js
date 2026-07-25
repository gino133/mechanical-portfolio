const Product = require('../models/Product');
const Category = require('../models/Category');
const removeDiacritics = require('../utils/removeDiacritics');

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
const getProducts = async (req, res) => {
    try {
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
            // Diacritic-insensitive: normalize the query the same way
            // searchText was normalized at save time, so "may ep" matches
            // a product named "Máy ép".
            query.searchText = { $regex: removeDiacritics(search), $options: 'i' };
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
    } catch (error) {
        console.error('getProducts error:', error);
        res.status(500).json({ success: false, message: 'Failed to load products' });
    }
};

// @desc    Get featured products
// @route   GET /api/v1/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
    try {
        const products = await Product.find({ isFeatured: true })
            .populate('category', 'name slug')
            .limit(6)
            .sort('-createdAt');

        res.json({
            success: true,
            data: products
        });
    } catch (error) {
        console.error('getFeaturedProducts error:', error);
        res.status(500).json({ success: false, message: 'Failed to load featured products' });
    }
};

// @desc    Get single product
// @route   GET /api/v1/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
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
    } catch (error) {
        console.error('getProductById error:', error);
        res.status(500).json({ success: false, message: 'Failed to load product' });
    }
};

// @desc    Create product
// @route   POST /api/v1/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    try {
        // Product.create() runs the pre-save hook, which computes
        // searchText automatically.
        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('createProduct error:', error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // FIX: findByIdAndUpdate does NOT run the pre-save hook, so
        // searchText must be recomputed by hand here whenever name/code
        // change - otherwise search on edited products goes stale.
        const nextName = req.body.name !== undefined ? req.body.name : product.name;
        const nextCode = req.body.code !== undefined ? req.body.code : product.code;
        const updates = {
            ...req.body,
            searchText: removeDiacritics(`${nextName} ${nextCode}`)
        };

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            data: updatedProduct
        });
    } catch (error) {
        console.error('updateProduct error:', error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete product
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
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
    } catch (error) {
        console.error('deleteProduct error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete product' });
    }
};

module.exports = {
    getProducts,
    getFeaturedProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
