const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const auth = require('../middleware/auth');
const { rbac, ROLES } = require('../middleware/rbac');

router.use(auth);

// Safety Officer added based on mockup checkmark logic
router.get('/stats', rbac([ROLES.FLEET_MANAGER, ROLES.DISPATCHER, ROLES.FINANCIAL_ANALYST, ROLES.SAFETY_OFFICER]), getDashboardStats);

module.exports = router;
