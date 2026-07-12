/**
 * RBAC middleware factory.
 * Usage: rbac(['Fleet Manager', 'Dispatcher'])
 */
const rbac = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role(s): ${allowedRoles.join(', ')}. Your role: ${req.user.role}`
      });
    }
    next();
  };
};

// Role constants for convenience
const ROLES = {
  FLEET_MANAGER: 'Fleet Manager',
  DISPATCHER: 'Dispatcher',
  SAFETY_OFFICER: 'Safety Officer',
  FINANCIAL_ANALYST: 'Financial Analyst'
};

const ALL_ROLES = Object.values(ROLES);

module.exports = { rbac, ROLES, ALL_ROLES };
