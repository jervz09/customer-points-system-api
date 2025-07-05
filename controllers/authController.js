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

		await db
			.insertInto('customer')
			.values({
				username,
				password: hashed,
				firstname,
				middlename,
				lastname,
				mobile_no,
				email,
			})
			.execute();

		res.status(201).json({ message: 'User registered successfully' });
	} catch (err) {
		res.status(500).json({ message: 'Unexpected error', error: err.message });
	}
};

export const loginCustomer = async (req, res) => {
	const { username, password } = req.body;
	try {
		const user = await db
			.selectFrom('customer')
			.selectAll()
			.where('username', '=', username)
			.executeTakeFirst();

		if (!user) {
			return res.status(401).json({ message: 'Invalid username or password' });
		}

		const match = await comparePassword(password, user.password);
		if (!match) {
			return res.status(401).json({ message: 'Invalid username or password' });
		}

		const token = generateToken({
			user_id: user.entity_id,
			username: user.username,
			user_type: 'customer',
		});

		res.json({ message: 'Login successful', token });
	} catch (err) {
		console.error('Login failed:', err);
		res.status(500).json({ message: 'DB error', error: err.message || err });
	}
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

		await db
			.insertInto('admins')
			.values({
				username,
				password: hashed,
				firstname,
				middlename,
				lastname,
				role_id,
				email,
			})
			.execute();

		res.status(201).json({ message: 'User registered successfully' });
	} catch (err) {
		res.status(500).json({ message: 'Unexpected error', error: err.message });
	}
};

export const loginAdmin = async (req, res) => {
	const { username, password } = req.body;

	try {
		const admin = await db
			.selectFrom('admins')
			.selectAll()
			.where('username', '=', username)
			.executeTakeFirst();

		if (!admin) {
			return res.status(401).json({ message: 'Invalid username or password' });
		}

		const match = await comparePassword(password, admin.password);
		if (!match) {
			return res.status(401).json({ message: 'Invalid username or password' });
		}

		const token = generateToken({
			user_id: admin.entity_id,
			username: admin.username,
			user_type: admin.role_id,
		});

		res.json({ message: 'Admin Login successful', token });
	} catch (err) {
		console.error('Login failed:', err);
		res.status(500).json({ message: 'DB error', error: err.message || err });
	}
};
