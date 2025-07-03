import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

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
		// Check if username exists
		db.query(
			'SELECT * FROM customer WHERE username = ?',
			[username],
			async (err, results) => {
				if (err)
					return res
						.status(500)
						.json({ message: 'Database error', error: err });

				if (results.length > 0) {
					return res.status(400).json({ message: 'Username already exists' });
				}

				// Hash password and insert
				const hashed = await bcrypt.hash(password, 10);

				db.query(
					'INSERT INTO customer (username, password, firstname, middlename, lastname, mobile_no, email) VALUES (?, ?, ?, ?, ?, ?, ?)',
					[username, hashed, firstname, middlename, lastname, mobile_no, email],
					insertErr => {
						if (insertErr)
							return res
								.status(500)
								.json({ message: 'Insert failed', error: insertErr });

						return res
							.status(201)
							.json({ message: 'User registered successfully' });
					}
				);
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
			const match = await bcrypt.compare(password, user.password);

			if (!match)
				return res
					.status(401)
					.json({ message: 'Invalid username or password' });

			const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
				expiresIn: '1h',
			});

			res.json({ message: 'Login successful', token });
		}
	);
};
