import { body } from 'express-validator';

export const userRegisterSchema = [
    body('first_name').notEmpty().withMessage('First name es requerido'),
    body('last_name').notEmpty().withMessage('Last name es requerido'),
    body('email').isEmail().withMessage('Email es invalido'),
    body('age').isInt({ min: 0 }).withMessage('Age debe ser un numero entero positivo'),
    body('password').isLength({ min: 6 }).withMessage('Password debe ser de al menos de 6 caracteres')
];

export const userLoginSchema = [
    body('email').isEmail().withMessage('Email es invalido'),
    body('password').notEmpty().withMessage('Password es requerido')
];