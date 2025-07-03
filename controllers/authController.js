import {
	checkIfExists,
	hashPassword,
	comparePassword,
	generateToken,
} from '../utils/authHelper.js';
import db from '../config/db.js';

// CUSTOMER
export const registerCustomer = async (req, res) => {
	const {
		username,
		firstname,
		middlename,
		lastname,
		mobile_no,
		password,
		email,
	} = req.body;

	try {
		const existing = await checkIfExists(
			'customer',
			['username', 'email'],
			[username, email]
		);

		if (existing.some(user => user.username === username)) {
			return res.status(400).json({ message: 'Username already exists' });
		}
		if (existing.some(user => user.email === email)) {
			return res.status(400).json({ message: 'Email already exists' });
		}

		const hashed = await hashPassword(password);

		db.query(
			'INSERT INTO customer (username, password, firstname, middlename, lastname, mobile_no, email) VALUES (?, ?, ?, ?, ?, ?, ?)',
			[username, hashed, firstname, middlename, lastname, mobile_no, email],
			err => {
				if (err)
					return res.status(500).json({ message: 'Insert failed', error: err });
				res.status(201).json({ message: 'User registered successfully' });
			}
		);
	} catch (err) {
		res.status(500).json({ message: 'Unexpected error', error: err.message });
	}
};

export const loginCustomer = (req, res) => {
	const { username, password } = req.body;

	db.query(
		'SELECT * FROM customer WHERE username = ?',
		[username],
		async (err, results) => {
			if (err) return res.status(500).json({ message: 'DB error', error: err });
			if (results.length === 0)
				return res
					.status(401)
					.json({ message: 'Invalid username or password' });

			const user = results[0];
			const match = await comparePassword(password, user.password);
			if (!match)
				return res
					.status(401)
					.json({ message: 'Invalid username or password' });

			const token = generateToken({ userId: user.id });
			res.json({ message: 'Login successful', token });
		}
	);
};

// ADMIN
export const registerAdmin = async (req, res) => {
	const {
		username,
		firstname,
		middlename,
		lastname,
		role_id,
		password,
		email,
	} = req.body;

	try {
		const existing = await checkIfExists(
			'admins',
			['username', 'email'],
			[username, email]
		);

		if (existing.some(admin => admin.username === username)) {
			return res.status(400).json({ message: 'Username already exists' });
		}
		if (existing.some(admin => admin.email === email)) {
			return res.status(400).json({ message: 'Email already exists' });
		}

		const hashed = await hashPassword(password);

		db.query(
			'INSERT INTO admins (username, password, firstname, middlename, lastname, role_id, email) VALUES (?, ?, ?, ?, ?, ?, ?)',
			[username, hashed, firstname, middlename, lastname, role_id, email],
			err => {
				if (err)
					return res.status(500).json({ message: 'Insert failed', error: err });
				res.status(201).json({ message: 'Admin registered successfully' });
			}
		);
	} catch (err) {
		res.status(500).json({ message: 'Unexpected error', error: err.message });
	}
};

export const loginAdmin = (req, res) => {
	const { username, password } = req.body;

	db.query(
		'SELECT * FROM admins WHERE username = ?',
		[username],
		async (err, results) => {
			if (err) return res.status(500).json({ message: 'DB error', error: err });
			if (results.length === 0)
				return res
					.status(401)
					.json({ message: 'Invalid username or password' });

			const admin = results[0];
			const match = await comparePassword(password, admin.password);
			if (!match)
				return res
					.status(401)
					.json({ message: 'Invalid username or password' });

			const token = generateToken({ userId: admin.id });
			res.json({ message: 'Login successful', token });
		}
	);
};
