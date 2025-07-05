import express from 'express';
import validateRequest from './middlewares/validateRequest.js';
import auth from './middlewares/auth.js';

// Controllers
import * as authController from './controllers/authController.js';
import * as promoController from './controllers/promoController.js';
// Validators
import validators from './validators/index.js';

const router = express.Router();

/**
 * =====================
 * Public Auth Routes
 * =====================
 */
router.post('/login', validators.auth.loginValidator, validateRequest, authController.loginCustomer);
router.post('/register', validators.auth.registerValidator, validateRequest, authController.registerCustomer);

router.post('/admin/login', validators.auth.loginValidator, validateRequest, authController.loginAdmin);
router.post('/admin/register', validators.auth.registerAdminValidator, validateRequest, authController.registerAdmin);

/**
 * =====================
 * Protected Routes
 * =====================
 */
router.use(auth);

router.post('/promo', validators.promo.addPromoValidator, validateRequest, promoController.createPromo);
router.put('/promo/:id', validators.promo.editPromoValidator, validateRequest, promoController.updatePromo);

// TODO: Add redeem promo, role management, etc.

export default router;
