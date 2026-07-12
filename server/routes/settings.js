const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
const auth = require('../middleware/auth');
const { rbac, ROLES } = require('../middleware/rbac');

router.use(auth);

router.get('/', getSettings); // Any authenticated user can read settings
router.put('/', rbac([ROLES.FLEET_MANAGER]), updateSettings); // Only FM can update

module.exports = router;
