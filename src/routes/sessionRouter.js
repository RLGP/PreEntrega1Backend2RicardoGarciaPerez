import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { userModel } from '../dao/models/userModel.js';
import passport from '../config/passportConfig.js';

const router = Router();

router.post('/', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).send({ status: 'error', message: 'Credentiales Invalidas' });
        }
        const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.status(200).send({ status: 'success', token });
    } catch (error) {
        res.status(400).send({ status: 'error', message: error.message });
    }
});

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.status(200).send({ status: 'success', payload: req.user });
});

export default router;