import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import passport from 'passport';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import productRouter from './routes/productRouter.js';
import cartRouter from './routes/cartRouter.js';
import viewsRouter from './routes/viewsRouter.js';
import userRouter from './routes/userRouter.js';
import sessionRouter from './routes/sessionRouter.js';
import __dirname from './utils/constantsUtil.js';
import websocket from './websocket.js';
import passportConfig from './config/passportConfig.js';
import connectDB from './config/db.js'; // Importar la función connectDB

dotenv.config();

const app = express();

connectDB(); // Conectar a la base de datos

//Handlebars Config
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/../views');
app.set('view engine', 'handlebars');

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(passport.initialize());
app.use(cookieParser());

//Routers
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/users', userRouter);
app.use('/api/sessions', sessionRouter);
app.use('/', viewsRouter);

const PORT = process.env.PORT || 8080;
const httpServer = app.listen(PORT, () => {
    console.log(`Server iniciado en el PORT ${PORT}`);
    console.log(`Nodemailer configurado con:
      Host: ${process.env.EMAIL_HOST}
      Port: ${process.env.EMAIL_PORT}
      User: ${process.env.EMAIL_USER}
      Pass: ${process.env.EMAIL_PASS}`);
});

const io = new Server(httpServer);

websocket(io);