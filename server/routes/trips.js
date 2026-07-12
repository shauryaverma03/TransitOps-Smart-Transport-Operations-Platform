const express = require('express');
const router = express.Router();
const { getTrips, getTrip, createTrip, dispatchTrip, completeTripStep1, completeTripStep2, completeTripStep3, cancelTrip } = require('../controllers/tripController');
const auth = require('../middleware/auth');
const { rbac, ROLES } = require('../middleware/rbac');

router.use(auth);

router.get('/', rbac([ROLES.FLEET_MANAGER, ROLES.DISPATCHER]), getTrips);
router.get('/:id', rbac([ROLES.FLEET_MANAGER, ROLES.DISPATCHER]), getTrip);

// Only Dispatcher manages trips
router.post('/', rbac([ROLES.DISPATCHER]), createTrip);
router.put('/:id/dispatch', rbac([ROLES.DISPATCHER]), dispatchTrip);
router.put('/:id/complete', rbac([ROLES.DISPATCHER]), completeTripStep1);
router.put('/:id/fuel', rbac([ROLES.DISPATCHER]), completeTripStep2);
router.put('/:id/expenses', rbac([ROLES.DISPATCHER]), completeTripStep3);
router.put('/:id/cancel', rbac([ROLES.DISPATCHER]), cancelTrip);

module.exports = router;
