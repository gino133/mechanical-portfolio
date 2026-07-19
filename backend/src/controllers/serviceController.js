const Service = require('../models/Service');

const slugify = (text) =>
    text
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

const DEFAULT_SERVICES = [
    {
        title: 'Cơ khí chính xác',
        slug: 'co-khi-chinh-xac',
        shortDescription: 'Thiết kế kết cấu, gia công CNC, chế tạo máy',
        order: 1
    },
    {
        title: 'Điện & Tự động hóa',
        slug: 'dien-tu-dong-hoa',
        shortDescription: 'Tủ điện công nghiệp, PLC, HMI, Scada',
        order: 2
    }
];

// @desc    Get active services, sorted for display (public - homepage cards)
// @route   GET /api/v1/services
// @access  Public
const getServices = async (req, res) => {
    const count = await Service.countDocuments();
    if (count === 0) {
        // First time this endpoint is ever hit: seed the 2 original
        // homepage cards so the site doesn't show a blank section before
        // the admin has created any services yet.
        await Service.insertMany(DEFAULT_SERVICES);
    }

    const services = await Service.find({ isActive: true }).sort('order');
    res.json({ success: true, data: services });
};

// @desc    Get all services including inactive ones (admin)
// @route   GET /api/v1/services/admin
// @access  Private/Admin
const getServicesAdmin = async (req, res) => {
    const services = await Service.find().sort('order');
    res.json({ success: true, data: services });
};

// @desc    Get a single service by slug or id
// @route   GET /api/v1/services/:slugOrId
// @access  Public
const getServiceBySlug = async (req, res) => {
    const { slugOrId } = req.params;
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(slugOrId);

    const service = await Service.findOne(isObjectId ? { _id: slugOrId } : { slug: slugOrId });

    if (!service) {
        return res.status(404).json({ success: false, message: 'Service not found' });
    }

    res.json({ success: true, data: service });
};

// @desc    Create service
// @route   POST /api/v1/services
// @access  Private/Admin
const createService = async (req, res) => {
    try {
        const baseSlug = req.body.slug ? slugify(req.body.slug) : slugify(req.body.title);
        let slug = baseSlug;
        let counter = 1;
        while (await Service.findOne({ slug })) {
            slug = `${baseSlug}-${counter}`;
            counter += 1;
        }

        const service = await Service.create({ ...req.body, slug });
        res.status(201).json({ success: true, data: service });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update service
// @route   PUT /api/v1/services/:id
// @access  Private/Admin
const updateService = async (req, res) => {
    const service = await Service.findById(req.params.id);
    if (!service) {
        return res.status(404).json({ success: false, message: 'Service not found' });
    }

    try {
        const updated = await Service.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.json({ success: true, data: updated });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete service
// @route   DELETE /api/v1/services/:id
// @access  Private/Admin
const deleteService = async (req, res) => {
    const service = await Service.findById(req.params.id);
    if (!service) {
        return res.status(404).json({ success: false, message: 'Service not found' });
    }
    await service.deleteOne();
    res.json({ success: true, message: 'Service removed' });
};

module.exports = {
    getServices,
    getServicesAdmin,
    getServiceBySlug,
    createService,
    updateService,
    deleteService
};
