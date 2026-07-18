const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
    getBlogs,
    getBlogsAdmin,
    getBlogBySlug,
    createBlog,
    updateBlog,
    deleteBlog
} = require('../controllers/blogController');

router.route('/')
    .get(getBlogs)
    .post(protect, admin, createBlog);

// Must be registered before '/:slugOrId' or Express would treat "admin" as a slug
router.get('/admin', protect, admin, getBlogsAdmin);

router.route('/:id')
    .put(protect, admin, updateBlog)
    .delete(protect, admin, deleteBlog);

router.get('/:slugOrId', getBlogBySlug);

module.exports = router;
