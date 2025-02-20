import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { userDBManager } from '../dao/userDBManager.js';
import { comparePassword } from '../utils/hashUtil.js';
import passport from '../config/passportConfig.js';
import dotenv from 'dotenv';
import { UserDTO } from '../dtos/userDTO.js';

dotenv.config();

const router = Router();
const UserService = new userDBManager();

router.post('/', async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await UserService.findUserByEmail(email);
      if (!user || !comparePassword(password, user.password)) {
        return res.status(401).send({ status: 'error', message: 'Credenciales Invalidas' });
      }
      // Se incluye el role en el payload
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
      
      // Se establece la cookie (ajusta secure según tu entorno)
      res.cookie("jwt", token, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', 
        maxAge: 3600000 // 1 hora en milisegundos
      });
      
      res.status(200).send({ status: 'success', token });
    } catch (error) {
      res.status(400).send({ status: 'error', message: error.message });
    }
  });

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    const userDTO = new UserDTO(req.user);
    res.status(200).send({ status: 'success', payload: userDTO });
});

export default router;