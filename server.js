import express from 'express';
import routes from './router.js';
import responseHelper from './utils/responseHelper.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(responseHelper);

// Register all modular routes
app.use('/api', routes);

// Add welcome routes
app.get('/', (req, res) => {
	res.send('Welcome to Customer Points System API (root)');
});

app.get('/api', (req, res) => {
	res.success(null, 'Welcome to Customer Points System - CPS');
});

// 404 handler
app.use((req, res) => {
	res.status(404).json({ status: 'error', message: 'Route not found' });
});

app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
});
