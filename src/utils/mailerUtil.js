import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    secure: false, 
    tls: {
        rejectUnauthorized: false
    }
});

console.log(`Nodemailer configurado con:
  Host: ${process.env.EMAIL_HOST}
  Port: ${process.env.EMAIL_PORT}
  User: ${process.env.EMAIL_USER}`);

export const sendMail = async (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to,
        subject,
        text
    };

    try {
        console.log(`Enviando email a: ${to}`);
        const info = await transporter.sendMail(mailOptions);
        console.log('Email enviado: ' + info.response);
    } catch (error) {
        console.error('Error al enviar el email: ', error);
    }
};