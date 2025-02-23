import { userDBManager } from '../dao/userDBManager.js';
import { hashPassword } from '../utils/hashUtil.js';
import { sendMail } from '../utils/mailerUtil.js';

const UserService = new userDBManager();

export const registerUser = async ({ first_name, last_name, email, age, password }) => {
    const hashedPassword = hashPassword(password);
    const newUser = await UserService.createUser({ first_name, last_name, email, age, password: hashedPassword });
    console.log(`Usuario registrado: ${email}`);
    
    // Modificar esta línea para pasar el objeto con los datos del usuario
    await sendMail(email, 'Bienvenido!', { first_name, last_name, email, age });
    
    console.log(`Email de bienvenida enviado a: ${email}`);
    return newUser;
};