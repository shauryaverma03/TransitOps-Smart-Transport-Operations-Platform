const express = require('express');
const router = express.Router();
const { getMaintenanceLogs, getMaintenanceLog, createMaintenanceLog, resolveMaintenanceLog, updateMaintenanceLog, deleteMaintenanceLog } = require('../controllers/maintenanceController');
const auth = require('../middleware/auth');
const { rbac, ROLES } = require('../middleware/rbac');

router.use(auth);

router.get('/', rbac([ROLES.FLEET_MANAGER, ROLES.DISPATCHER]), getMaintenanceLogs);
router.get('/:id', rbac([ROLES.FLEET_MANAGER]), getMaintenanceLog);

router.post('/', rbac([ROLES.FLEET_MANAGER]), createMaintenanceLog);
router.put('/:id/resolve', rbac([ROLES.FLEET_MANAGER]), resolveMaintenanceLog);
router.put('/:id', rbac([ROLES.FLEET_MANAGER]), updateMaintenanceLog);
router.delete('/:id', rbac([ROLES.FLEET_MANAGER]), deleteMaintenanceLog);

module.exports = router;
