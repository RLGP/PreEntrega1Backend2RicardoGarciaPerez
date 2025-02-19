import { registerUser } from '../services/userService.js';
import { validationResult } from 'express-validator';

export const registerUserController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { first_name, last_name, email, age, password } = req.body;
    try {
        const newUser = await registerUser({ first_name, last_name, email, age, password });
        res.status(201).json({ status: 'success', payload: newUser });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ status: 'error', message: 'El correo electrónico ya está registrado' });
        }
        console.error('Error al registrar el usuario:', error);
        res.status(400).json({ status: 'error', message: error.message });
    }
};