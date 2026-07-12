const express = require('express');
const router = express.Router();
const { getDrivers, getAvailableDrivers, getDriver, createDriver, updateDriver, deleteDriver } = require('../controllers/driverController');
const auth = require('../middleware/auth');
const { rbac, ROLES } = require('../middleware/rbac');

router.use(auth);

router.get('/', rbac([ROLES.FLEET_MANAGER, ROLES.DISPATCHER, ROLES.SAFETY_OFFICER]), getDrivers);
router.get('/available', rbac([ROLES.FLEET_MANAGER, ROLES.DISPATCHER]), getAvailableDrivers);
router.get('/:id', rbac([ROLES.FLEET_MANAGER, ROLES.DISPATCHER, ROLES.SAFETY_OFFICER]), getDriver);

router.post('/', rbac([ROLES.DISPATCHER, ROLES.SAFETY_OFFICER]), createDriver);
router.put('/:id', rbac([ROLES.DISPATCHER, ROLES.SAFETY_OFFICER]), updateDriver);
router.delete('/:id', rbac([ROLES.SAFETY_OFFICER]), deleteDriver);

module.exports = router;
