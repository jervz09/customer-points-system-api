import { body } from 'express-validator';

const editPromoValidator = [
	body('qr_token').notEmpty().withMessage('QR Token is required'),
	body('duration_minutes').notEmpty().withMessage('QR Token is required'),
];
export default editPromoValidator;
