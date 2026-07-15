const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
    getProjects,
    getFeaturedProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
} = require('../controllers/projectController');

router.route('/')
    .get(getProjects)
    .post(protect, admin, createProject);

// Must be registered before '/:id' or Express would treat "featured" as an id
router.get('/featured', getFeaturedProjects);

router.route('/:id')
    .get(getProjectById)
    .put(protect, admin, updateProject)
    .delete(protect, admin, deleteProject);

module.exports = router;
