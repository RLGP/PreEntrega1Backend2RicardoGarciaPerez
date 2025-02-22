import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const ticketCollection = 'tickets';

const ticketSchema = new mongoose.Schema({
    code: {type: String, unique: true, default: uuidv4},
    purchase_datetime: {type: Date, default: Date.now},
    amount: {type: Number, required: true},
    purchaser: {type: String, required: true},
    products: [{
        product: {type: Object, required: true},
        quantity: {type: Number, required: true}
    }]
});

export const ticketModel = mongoose.model(ticketCollection, ticketSchema);