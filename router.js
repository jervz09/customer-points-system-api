import express from 'express';
import validateRequest from './middlewares/validateRequest.js';
import auth from './middlewares/auth.js';
import requireRole from './middlewares/hasRole.js';

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

/**
 * =====================
 * Promo Routes
 * =====================
 */
router.get('/promos', promoController.getAllPromo);
router.get('/promo/:id', promoController.getOnePromo);
router.post('/promo', requireRole(['admin','operator']), validators.promo.addPromoValidator, validateRequest, promoController.createPromo);
router.put('/promo/:id', requireRole(['admin','operator']), validators.promo.editPromoValidator, validateRequest, promoController.updatePromo);
router.patch('/promo/:id/activate', requireRole(['admin','operator']), promoController.activatePromo);
router.patch('/promo/:id/deactivate', requireRole(['admin','operator']), promoController.deactivatePromo);
router.patch('/promo/:id/delete', requireRole(['admin','operator']), promoController.softDeletePromo);

// TODO: Add redeem promo, role management, etc.

export default router;
