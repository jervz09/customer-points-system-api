import express from 'express';
import validateRequest from './middlewares/validateRequest.js';
import auth from './middlewares/auth.js';
import requireRole from './middlewares/hasRole.js';

// Controllers
import * as authController from './controllers/authController.js';
import * as promoController from './controllers/promoController.js';
import * as scanController from './controllers/scanController.js';

// Validators
import validators from './validators/index.js';

const router = express.Router();

const high_level = ['admin','operator'];
/**
 * =====================
 * Public Auth Routes
 * =====================
 */
router.post('/login',                               validators.auth.loginValidator, validateRequest,        authController.loginCustomer);
router.post('/register',                            validators.auth.registerValidator, validateRequest,     authController.registerCustomer);

router.post('/admin/login',                         validators.auth.loginValidator, validateRequest,        authController.loginAdmin);
router.post('/admin/register',                      validators.auth.registerAdminValidator, validateRequest,authController.registerAdmin);


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
router.get('/promos',                                                                                       promoController.getAllPromo);
router.get('/promo/:id',                                                                                    promoController.getOnePromo);
router.post('/promo',       requireRole(high_level), validators.promo.addPromoValidator, validateRequest,   promoController.createPromo);
router.put('/promo/:id',    requireRole(high_level), validators.promo.editPromoValidator, validateRequest,  promoController.updatePromo);
router.patch('/promo/:id/activate',     requireRole(high_level),                                            promoController.activatePromo);
router.patch('/promo/:id/deactivate',   requireRole(high_level),                                            promoController.deactivatePromo);
router.patch('/promo/:id/delete',       requireRole(high_level),                                            promoController.softDeletePromo);


/**
 * =====================
 * Scan Routes
 * =====================
 */

router.post('/scan/auto',                              validators.scan.autoScanValidator, validateRequest,  scanController.handleScanAuto);
router.post('/scan/manual',                            validators.scan.manualScanValidator, validateRequest,scanController.handleScanManual);

// TODO: Add redeem promo, role management, etc.

export default router;
