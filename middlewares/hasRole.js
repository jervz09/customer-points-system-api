import { hasRole } from '../utils/roleChecker.js';

export default function requireRole(allowedRoles = []) {
	return (req, res, next) => {
		console.log(req.user);
		if (!hasRole(req.user, allowedRoles)) {
			return res.error('Access denied', 403);
		}
		next();
	};
}
