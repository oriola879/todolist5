const path = require('path');

const express = require('express');
const User = require('../models/user');

const { check, body } = require('express-validator')

const authController = require('../controllers/auth');

const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.get('/signup', authController.getSignup);

router.post('/signup', check('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
            if (userDoc) {
                return Promise.reject('Email exists already, please pick a different one. ');
            }
        });
    }).normalizeEmail(),
    body('password',
        'Please enter a password with only numbers and text and at least 5 characters long.')
        .isLength({ min: 5 }).isAlphanumeric().trim(),
    body('confirmPassword').trim().custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords have to match!');
        }
        return true;
    }),
    authController.postSignup);

router.post('/logout',
    [body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email.'),
    body('password', 'Please enter a valid password.').isLength({ min: 5 }).isAlphanumeric().trim()], 
    isAuth, authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);



module.exports = router;