import express from 'express';
import validateRequest from './middlewares/validateRequest.js';

import registerValidator from './validators/registerValidator.js';
import loginValidator from './validators/loginValidator.js';
const router = express.Router();

// Middleware
import auth from './middlewares/auth.js';

// Controllers
import * as authController from './controllers/authController.js';

/**
 * =====================
 * Auth Routes
 * =====================
 */
router.post(
	'/login',
	loginValidator,
	validateRequest,
	authController.loginCustomer
);
router.post(
	'/register',
	registerValidator,
	validateRequest,
	authController.registerCustomer
);

router.post(
	'/register',
	registerValidator,
	validateRequest,
	authController.registerCustomer
);


router.use(auth); // Apply auth middleware to all routes below

export default router;
