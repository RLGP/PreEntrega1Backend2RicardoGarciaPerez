import Joi from 'joi';

export const userRegisterSchema = Joi.object({
    first_name: Joi.string().required().messages({
        'string.empty': 'Nombre es requerido'
    }),
    last_name: Joi.string().required().messages({
        'string.empty': 'Apellido es requerido'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Email es invalido'
    }),
    age: Joi.number().integer().min(0).required().messages({
        'number.min': 'Edad debe ser un numero entero positivo'
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'La Contraseña debe ser de al menos de 6 caracteres'
    })
});

export const userLoginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Email es invalido'
    }),
    password: Joi.string().required().messages({
        'string.empty': 'Contraseña es requerida'
    })
});