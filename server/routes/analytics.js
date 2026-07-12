const express = require('express');
const router = express.Router();
const { getAnalyticsSummary, exportCSV } = require('../controllers/analyticsController');
const auth = require('../middleware/auth');
const { rbac, ROLES } = require('../middleware/rbac');

router.use(auth);

router.get('/summary', rbac([ROLES.FLEET_MANAGER, ROLES.FINANCIAL_ANALYST, ROLES.SAFETY_OFFICER]), getAnalyticsSummary);
router.get('/export/csv', rbac([ROLES.FLEET_MANAGER, ROLES.FINANCIAL_ANALYST]), exportCSV);

module.exports = router;
