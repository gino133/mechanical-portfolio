const express = require('express');
const router = express.Router();
const { createAdminViaUrl } = require('../controllers/setupController');

router.get('/create-admin', createAdminViaUrl);

module.exports = router;
