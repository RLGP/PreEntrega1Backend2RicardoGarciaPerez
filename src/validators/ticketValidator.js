import Joi from 'joi';

export const ticketSchema = Joi.object({
    id: Joi.string().optional(),
    code: Joi.string().required(),
    purchase_datetime: Joi.date().required(),
    amount: Joi.number().required(),
    purchaser: Joi.string().email().required(),
    products: Joi.array().items(
        Joi.object({
            product: Joi.string().required(),
            quantity: Joi.number().required()
        })
    ).required()
});