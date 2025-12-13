const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const sweetController = require('../controllers/sweet.controller');

// All sweets routes require authenticated user
router.post('/sweets', authMiddleware.authMiddleware, sweetController.createSweet);
router.get('/sweets', authMiddleware.authMiddleware, sweetController.getAllSweets);
router.get('/sweets/search', authMiddleware.authMiddleware, sweetController.searchSweets);
router.put('/sweets/:id', authMiddleware.authMiddleware, sweetController.updateSweet);
router.delete('/sweets/:id', authMiddleware.authMiddleware, authMiddleware.adminOnly, sweetController.deleteSweet);

// Purchase a sweet (decrease quantity)
router.post('/sweets/:id/purchase', authMiddleware.authMiddleware, sweetController.purchaseSweet);

// Restock a sweet (increase quantity, admin only)
router.post('/sweets/:id/restock', authMiddleware.authMiddleware, authMiddleware.adminOnly, sweetController.restockSweet);

module.exports = router;