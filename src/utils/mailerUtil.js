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

  const createWelcomeEmailTemplate = (userData) => {
    return `
    <div style="background-color: black; color: white; font-family: Arial, sans-serif; padding: 20px;">
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
            <h1>¡Bienvenido ${userData.first_name}!</h1>
            
            <div style="display: flex; flex-direction: column; padding: 10px; margin: 5px; border: 1px solid white;">
                <p>Gracias por registrarte en nuestra plataforma.</p>
                <p>Tu cuenta ha sido creada exitosamente con el email: ${userData.email}</p>
            </div>
            
            <div style="margin-top: 10px;">
                <a href="http://localhost:8080/login" 
                   style="background: #1da81d; 
                          cursor: pointer;
                          padding: 5px;
                          border-radius: 5px;
                          text-decoration: none;
                          color: white;">
                    Iniciar Sesión
                </a>
            </div>
        </div>
    </div>
    `;
};

export const sendMail = async (to, subject, userData) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: to,
        subject: subject,
        html: createWelcomeEmailTemplate(userData)
    };

    try {
        console.log(`Enviando email a: ${to}`);
        const info = await transporter.sendMail(mailOptions);
        console.log('Email enviado: ' + info.response);
    } catch (error) {
        console.error('Error al enviar el email: ', error);
    }
};