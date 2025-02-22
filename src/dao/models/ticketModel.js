import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const ticketCollection = 'tickets';

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        default: uuidv4
    },
    purchase_datetime: {
        type: Date,
        default: Date.now
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        required: true
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }]
});

// Añade el middleware pre para hacer el populate automáticamente
ticketSchema.pre('find', function() {
    this.populate('products.product');
});

ticketSchema.pre('findOne', function() {
    this.populate('products.product');
});

export const ticketModel = mongoose.model(ticketCollection, ticketSchema);