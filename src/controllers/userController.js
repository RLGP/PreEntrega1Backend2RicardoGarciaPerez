import { registerUser } from '../services/userService.js';

export const registerUserController = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        const newUser = await registerUser({ first_name, last_name, email, age, password });
        
        res.status(201).json({
            status: 'success',
            message: 'Usuario registrado exitosamente',
            data: newUser
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                status: 'error',
                message: 'El email ya está registrado'
            });
        }
        console.error(error);
        res.status(400).json({
            status: 'error',
            message: 'Error al registrar usuario'
        });
    }
};

export const loginUserController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await loginUser({ email, password });
        
        res.status(200).json({
            status: 'success',
            message: 'Login exitoso',
            data: user
        });
    } catch (error) {
        console.error(error);
        res.status(401).json({
            status: 'error',
            message: 'Credenciales inválidas'
        });
    }
};