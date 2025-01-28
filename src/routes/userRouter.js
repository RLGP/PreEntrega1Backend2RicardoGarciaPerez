import { Router } from 'express';
import bcrypt from 'bcrypt';
import { userModel } from '../dao/models/userModel.js';

const router = Router();

router.post('/', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    if (!first_name || !last_name || !email || !age || !password) {
        return res.status(400).send({ status: 'error', message: 'Se requieren todos los campos' });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    try {
        const newUser = await userModel.create({ first_name, last_name, email, age, password: hashedPassword });
        res.status(201).send({ status: 'success', payload: newUser });
    } catch (error) {
        res.status(400).send({ status: 'error', message: error.message });
    }
});

router.patch('/', async (req, res) => {
    const { email, ...updateData } = req.body;
    if (!email) {
        return res.status(400).send({ status: 'error', message: 'se requiere el Email' });
    }
    try {
        const updatedUser = await userModel.findOneAndUpdate({ email }, updateData, { new: true });
        res.status(200).send({ status: 'success', payload: updatedUser });
    } catch (error) {
        res.status(400).send({ status: 'error', message: error.message });
    }
});

router.delete('/', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).send({ status: 'error', message: 'Se requiere el Email' });
    }
    try {
        await userModel.findOneAndDelete({ email });
        res.status(204).send();
    } catch (error) {
        res.status(400).send({ status: 'error', message: error.message });
    }
});

export default router;