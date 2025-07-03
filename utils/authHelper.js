import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

export const checkIfExists = (table, fields, values) => {
	const conditions = fields.map(f => `${f} = ?`).join(' OR ');
	return new Promise((resolve, reject) => {
		db.query(`SELECT * FROM ${table} WHERE ${conditions}`, values, (err, results) => {
			if (err) return reject(err);
			resolve(results);
		});
	});
};

export const hashPassword = (password) => {
	return bcrypt.hash(password, 10);
};

export const comparePassword = (plain, hash) => {
	return bcrypt.compare(plain, hash);
};

export const generateToken = (payload) => {
	return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};
