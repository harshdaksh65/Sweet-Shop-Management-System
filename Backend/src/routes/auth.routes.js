const express = require('express');
const router = express.Router();
const validators = require('../middlewares/validator.middleware')
const authController = require('../controllers/auth.controller')
const authMiddleware = require('../middlewares/auth.middleware')

const User = require('../models/user.model');
const bcrypt = require('bcrypt');


router.post('/register',validators.registerUserValidator,authController.registerUser)
router.post('/login',validators.loginUserValidator,authController.loginUser)
router.get('/me',authMiddleware.authMiddleware,authController.getCurrentUser)


module.exports = router; 