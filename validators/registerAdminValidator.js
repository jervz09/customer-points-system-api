import { body } from 'express-validator';

const registerValidator = [
    body('email').isEmail().withMessage('A valid email is required'),

    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),

    body('username').notEmpty().withMessage('Username is required'),
    body('firstname').notEmpty().withMessage('First Name is required'),
    body('lastname').notEmpty().withMessage('Last Name is required'),
    body('role_id').notEmpty().withMessage('Role is required'),
];
export default registerValidator;
