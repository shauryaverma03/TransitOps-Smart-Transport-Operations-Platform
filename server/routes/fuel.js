const express = require('express');
const router = express.Router();
const { getFuelLogs, createFuelLog, updateFuelLog, deleteFuelLog } = require('../controllers/fuelController');
const auth = require('../middleware/auth');
const { rbac, ROLES } = require('../middleware/rbac');

router.use(auth);

router.get('/', rbac([ROLES.FINANCIAL_ANALYST, ROLES.FLEET_MANAGER]), getFuelLogs);
router.post('/', rbac([ROLES.FINANCIAL_ANALYST, ROLES.FLEET_MANAGER, ROLES.DISPATCHER]), createFuelLog);
router.put('/:id', rbac([ROLES.FINANCIAL_ANALYST]), updateFuelLog);
router.delete('/:id', rbac([ROLES.FINANCIAL_ANALYST]), deleteFuelLog);

module.exports = router;
