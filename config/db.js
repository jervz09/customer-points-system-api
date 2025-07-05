import { Kysely, MysqlDialect } from 'kysely';
import { createPool } from 'mysql2';

const db = new Kysely({
	dialect: new MysqlDialect({
		pool: createPool({
			host: process.env.DB_HOST || 'localhost',
			user: process.env.DB_USER || 'root',
			password: process.env.DB_PASS || 'root',
			database: process.env.DB_NAME || 'customer_points_system',
		}),
	}),
});

export default db;
