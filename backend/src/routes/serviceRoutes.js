const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
    getServices,
    getServicesAdmin,
    getServiceBySlug,
    createService,
    updateService,
    deleteService
} = require('../controllers/serviceController');

router.route('/')
    .get(getServices)
    .post(protect, admin, createService);

// Must be registered before '/:slugOrId' or Express would treat "admin" as a slug
router.get('/admin', protect, admin, getServicesAdmin);

router.route('/:id')
    .put(protect, admin, updateService)
    .delete(protect, admin, deleteService);

router.get('/:slugOrId', getServiceBySlug);

module.exports = router;
