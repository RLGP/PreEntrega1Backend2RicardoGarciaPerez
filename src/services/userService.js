import { userDBManager } from '../dao/userDBManager.js';
import { hashPassword, comparePassword } from '../utils/hashUtil.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { sendMail } from '../utils/mailerUtil.js';

dotenv.config();

const UserService = new userDBManager();

export const registerUser = async ({ first_name, last_name, email, age, password }) => {
    const hashedPassword = hashPassword(password);
    const newUser = await UserService.createUser({ first_name, last_name, email, age, password: hashedPassword });
    await sendMail(email, 'Bienvenido!', 'Gracias por registrarte!');
    return newUser;
};

export const loginUser = async (email, password) => {
    const user = await UserService.findUserByEmail(email);
    if (!user || !comparePassword(password, user.password)) {
        throw new Error('Invalid credentials');
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
};