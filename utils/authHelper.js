import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const hashPassword = password => {
	return bcrypt.hash(password, 10);
};

export const comparePassword = (plain, hash) => {
	return bcrypt.compare(plain, hash);
};

export const generateToken = payload => {
	return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};
