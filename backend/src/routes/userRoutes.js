const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const menuController = require('../controllers/menuController');
const orderController = require('../controllers/orderController');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Menu routes
router.get('/menu-items', menuController.index);
router.get('/menu-items/:id', menuController.show);
router.post('/menu-items', authMiddleware.verifyToken, adminMiddleware, menuController.store);
router.put('/menu-items/:id', authMiddleware.verifyToken, adminMiddleware, menuController.update);
router.delete('/menu-items/:id', authMiddleware.verifyToken, adminMiddleware, menuController.destroy);

// User routes (admin-only access for user management)
router.get('/users', authMiddleware.verifyToken, adminMiddleware, userController.getAllUsers);
router.get('/users/:id', authMiddleware.verifyToken, adminMiddleware, userController.getUserById);
router.put('/users/:id', authMiddleware.verifyToken, adminMiddleware, userController.updateUser);
router.delete('/users/:id', authMiddleware.verifyToken, adminMiddleware, userController.deleteUser);

router.post('/orders', authMiddleware.verifyToken, orderController.createOrder);
router.get('/orders', authMiddleware.verifyToken, adminMiddleware, orderController.index);
router.get('/orders/history', authMiddleware.verifyToken, orderController.getOrderHistory);
router.post('/orders/:id/payment', authMiddleware.verifyToken, orderController.createPayment);
router.post('/orders/:id/review', authMiddleware.verifyToken, orderController.createReview);
router.get('/orders/:id', authMiddleware.verifyToken, orderController.show);
router.patch('/orders/:id/confirm', authMiddleware.verifyToken, adminMiddleware, orderController.confirmOrder);
router.delete('/orders/:id', authMiddleware.verifyToken, adminMiddleware, orderController.destroy);

router.post('/orders/:orderId/review', authMiddleware.verifyToken, reviewController.store);
router.put('/orders/:orderId/review', authMiddleware.verifyToken, adminMiddleware, reviewController.update);
router.delete('/orders/:orderId/review', authMiddleware.verifyToken, adminMiddleware, reviewController.destroy);
router.get('/orders/:orderId/review/:reviewId', authMiddleware.verifyToken, reviewController.show);

module.exports = router;
