const Blog = require('../models/Blog');

const slugify = (text) =>
    text
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

// @desc    Get published blog posts (public)
// @route   GET /api/v1/blog
// @access  Public
const getBlogs = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const startIndex = (page - 1) * limit;
    const category = req.query.category;
    const search = req.query.search;

    let query = { isPublished: true };

    if (category && category !== 'all') {
        query.category = category;
    }
    if (search) {
        query.title = { $regex: search, $options: 'i' };
    }

    const posts = await Blog.find(query)
        .populate('category', 'name slug')
        .sort('-createdAt')
        .limit(limit)
        .skip(startIndex)
        .select('-content'); // listing doesn't need full HTML content

    const total = await Blog.countDocuments(query);

    res.json({
        success: true,
        data: posts,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
};

// @desc    Get all posts including drafts (admin)
// @route   GET /api/v1/blog/admin
// @access  Private/Admin
const getBlogsAdmin = async (req, res) => {
    const posts = await Blog.find()
        .populate('category', 'name slug')
        .sort('-createdAt')
        .select('-content');

    res.json({ success: true, data: posts });
};

// @desc    Get a single post by slug or id (public - only if published, unless admin)
// @route   GET /api/v1/blog/:slugOrId
// @access  Public
const getBlogBySlug = async (req, res) => {
    const { slugOrId } = req.params;
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(slugOrId);

    const post = await Blog.findOne(isObjectId ? { _id: slugOrId } : { slug: slugOrId })
        .populate('category', 'name slug');

    if (!post) {
        return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (!post.isPublished) {
        return res.status(404).json({ success: false, message: 'Post not found' });
    }

    post.viewCount += 1;
    await post.save();

    res.json({ success: true, data: post });
};

// @desc    Create post
// @route   POST /api/v1/blog
// @access  Private/Admin
const createBlog = async (req, res) => {
    try {
        const baseSlug = req.body.slug ? slugify(req.body.slug) : slugify(req.body.title);
        let slug = baseSlug;
        let counter = 1;
        while (await Blog.findOne({ slug })) {
            slug = `${baseSlug}-${counter}`;
            counter += 1;
        }

        const post = await Blog.create({ ...req.body, slug });
        res.status(201).json({ success: true, data: post });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update post
// @route   PUT /api/v1/blog/:id
// @access  Private/Admin
const updateBlog = async (req, res) => {
    const post = await Blog.findById(req.params.id);
    if (!post) {
        return res.status(404).json({ success: false, message: 'Post not found' });
    }

    try {
        const updates = { ...req.body };
        if (updates.title && updates.title !== post.title && !req.body.slug) {
            // keep the existing slug unless the admin explicitly changes it,
            // to avoid breaking already-shared links every time the title
            // is tweaked
        }
        const updated = await Blog.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true
        });
        res.json({ success: true, data: updated });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete post
// @route   DELETE /api/v1/blog/:id
// @access  Private/Admin
const deleteBlog = async (req, res) => {
    const post = await Blog.findById(req.params.id);
    if (!post) {
        return res.status(404).json({ success: false, message: 'Post not found' });
    }
    await post.deleteOne();
    res.json({ success: true, message: 'Post removed' });
};

module.exports = {
    getBlogs,
    getBlogsAdmin,
    getBlogBySlug,
    createBlog,
    updateBlog,
    deleteBlog
};
