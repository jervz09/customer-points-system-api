import { body } from 'express-validator';

const registerValidator = [
	body('password')
		.isLength({ min: 6 })
		.withMessage('Password must be at least 6 characters'),
	body('username').notEmpty().withMessage('Username is required'),
];
export default registerValidator;
