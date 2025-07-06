import { Kysely, MysqlDialect } from 'kysely';
import { createPool } from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const db = new Kysely({
	dialect: new MysqlDialect({
		pool: createPool({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME,
		}),
	}),
});

export default db;
