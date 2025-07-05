import { body } from 'express-validator';

const editPromoValidator = [
	body('promo_name').notEmpty().withMessage('Promo Name is required'),
	body('points').notEmpty().withMessage('Points is required'),
];
export default editPromoValidator;
