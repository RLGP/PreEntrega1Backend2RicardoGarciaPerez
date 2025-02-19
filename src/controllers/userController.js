import { userService } from '../services/userService.js';
import { validationResult } from 'express-validator';

export const registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { first_name, last_name, email, age, password } = req.body;
    try {
        const newUser = await userService.registerUser({ first_name, last_name, email, age, password });
        res.status(201).json({ status: 'success', payload: newUser });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ status: 'error', message: 'El correo electrónico ya está registrado' });
        }
        res.status(400).json({ status: 'error', message: error.message });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await userService.loginUser(email, password);
        res.status(200).json({ status: 'success', token });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};