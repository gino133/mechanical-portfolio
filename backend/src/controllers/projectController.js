const Project = require('../models/Project');
const Category = require('../models/Category');

// @desc    Get all projects
// @route   GET /api/v1/projects
// @access  Public
const getProjects = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = (page - 1) * limit;
        const category = req.query.category;
        const year = req.query.year;

        let query = {};

        if (category && category !== 'all') {
            const categoryDoc = await Category.findOne({ name: category, type: 'project' });
            if (categoryDoc) {
                query.category = categoryDoc._id;
            }
        }

        if (year) {
            query.year = year;
        }

        // FIX: Query#sort() takes a single argument - a space-separated
        // string or an object - not multiple string arguments. The extra
        // "-createdAt" argument was silently ignored before, so results
        // were only ever sorted by year.
        const projects = await Project.find(query)
            .populate('category', 'name slug')
            .sort('-year -createdAt')
            .limit(limit)
            .skip(startIndex);

        const total = await Project.countDocuments(query);

        res.json({
            success: true,
            data: projects,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('getProjects error:', error);
        res.status(500).json({ success: false, message: 'Failed to load projects' });
    }
};

// @desc    Get featured projects
// @route   GET /api/v1/projects/featured
// @access  Public
const getFeaturedProjects = async (req, res) => {
    try {
        const projects = await Project.find({ isFeatured: true })
            .populate('category', 'name slug')
            .sort('-createdAt')
            .limit(6);

        res.json({
            success: true,
            data: projects
        });
    } catch (error) {
        console.error('getFeaturedProjects error:', error);
        res.status(500).json({ success: false, message: 'Failed to load featured projects' });
    }
};

// @desc    Get single project
// @route   GET /api/v1/projects/:id
// @access  Public
const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('category', 'name slug')
            .populate('documents');

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        // Increment view count
        project.viewCount += 1;
        await project.save();

        res.json({
            success: true,
            data: project
        });
    } catch (error) {
        console.error('getProjectById error:', error);
        res.status(500).json({ success: false, message: 'Failed to load project' });
    }
};

// @desc    Create project
// @route   POST /api/v1/projects
// @access  Private/Admin
const createProject = async (req, res) => {
    try {
        const project = await Project.create(req.body);

        res.status(201).json({
            success: true,
            data: project
        });
    } catch (error) {
        console.error('createProject error:', error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update project
// @route   PUT /api/v1/projects/:id
// @access  Private/Admin
const updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            data: updatedProject
        });
    } catch (error) {
        console.error('updateProject error:', error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete project
// @route   DELETE /api/v1/projects/:id
// @access  Private/Admin
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        await project.deleteOne();

        res.json({
            success: true,
            message: 'Project removed'
        });
    } catch (error) {
        console.error('deleteProject error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete project' });
    }
};

module.exports = {
    getProjects,
    getFeaturedProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
};
