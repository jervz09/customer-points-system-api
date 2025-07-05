import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
	const authHeader = req.headers.authorization;

	// Check for token
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.error('Access denied. No token provided.', 401);
	}

	const token = authHeader.split(' ')[1];

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded; // attach user to request
		next();
	} catch (errors) {
		res.error('Invalid or expired token.', 401, errors);
	}
};

export default authMiddleware;
