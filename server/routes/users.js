const express = require('express');
const router = express.Router();
const { getUsers, createUser, updateUser } = require('../controllers/userController');
const auth = require('../middleware/auth');
const { rbac, ROLES } = require('../middleware/rbac');

router.use(auth);

// Only Fleet Manager can manage users
router.get('/', rbac([ROLES.FLEET_MANAGER]), getUsers);
router.post('/', rbac([ROLES.FLEET_MANAGER]), createUser);
router.put('/:id', rbac([ROLES.FLEET_MANAGER]), updateUser);

module.exports = router;
