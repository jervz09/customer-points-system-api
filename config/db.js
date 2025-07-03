import mysql from 'mysql2';

const connection = mysql.createConnection({
	host: process.env.DB_HOST || 'localhost',
	user: process.env.DB_USER || 'root',
	password: process.env.DB_PASS || 'root',
	database: process.env.DB_NAME || 'customer_points_system',
});

connection.connect(err => {
	if (err) {
		console.error('Database connection failed:', err.message);
		process.exit(1); // Exit process with failure
	}
	console.log('✅ Connected to MySQL database.');
});

export default connection;
