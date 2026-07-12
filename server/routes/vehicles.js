const express = require('express');
const router = express.Router();
const { getVehicles, getAvailableVehicles, getVehicle, createVehicle, updateVehicle, deleteVehicle } = require('../controllers/vehicleController');
const auth = require('../middleware/auth');
const { rbac, ROLES } = require('../middleware/rbac');

router.use(auth); // All vehicle routes require auth

router.get('/', rbac([ROLES.FLEET_MANAGER, ROLES.DISPATCHER]), getVehicles);
router.get('/available', rbac([ROLES.FLEET_MANAGER, ROLES.DISPATCHER]), getAvailableVehicles);
router.get('/:id', rbac([ROLES.FLEET_MANAGER, ROLES.DISPATCHER]), getVehicle);

router.post('/', rbac([ROLES.FLEET_MANAGER]), createVehicle);
router.put('/:id', rbac([ROLES.FLEET_MANAGER]), updateVehicle);
router.delete('/:id', rbac([ROLES.FLEET_MANAGER]), deleteVehicle);

module.exports = router;
