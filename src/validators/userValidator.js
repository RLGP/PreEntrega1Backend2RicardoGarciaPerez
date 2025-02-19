import { body } from 'express-validator';

export const userRegisterSchema = [
    body('first_name').notEmpty().withMessage('First name is required'),
    body('last_name').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Email is invalid'),
    body('age').isInt({ min: 0 }).withMessage('Age must be a positive integer'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

export const userLoginSchema = [
    body('email').isEmail().withMessage('Email is invalid'),
    body('password').notEmpty().withMessage('Password is required')
];