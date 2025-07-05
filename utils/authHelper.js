import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';
import { sql } from 'kysely';

/**
 * Checks if a record exists in the given table with any matching field.
 * Fields are matched using OR logic.
 */
export async function checkIfExists(table, fields, values) {
	if (fields.length !== values.length) {
		throw new Error('Fields and values length mismatch');
	}

	// Build dynamic OR conditions
	const conditions = fields.map(
		(field, i) => sql`${sql.ref(field)} = ${values[i]}`
	);
	const whereClause = conditions.reduce((acc, curr, index) => {
		return index === 0 ? curr : sql`${acc} OR ${curr}`;
	}, null);

	const result = await db
		.selectFrom(table)
		.selectAll()
		.where(() => whereClause)
		.execute();

	return result;
}

export const hashPassword = password => {
	return bcrypt.hash(password, 10);
};

export const comparePassword = (plain, hash) => {
	return bcrypt.compare(plain, hash);
};

export const generateToken = payload => {
	return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};
