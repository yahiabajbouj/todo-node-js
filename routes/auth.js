const express = require('express');
const authController = require('../controllers/auth');
const { body } = require('express-validator/check');
const User = require('../models/user');
const router = express.Router();

router.post('/login',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .normalizeEmail(),
        body('password')
            .trim()
            .isLength({ min: 5 }),
    ],
    authController.login);

router.post('/rigester',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .normalizeEmail(),
        body('password')
            .trim()
            .isLength({ min: 5 }),
        body('name')
            .trim()
            .not()
            .isEmpty()
    ]
    , authController.signup);

module.exports = router;