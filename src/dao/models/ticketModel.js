import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

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

ticketSchema.pre('findOne', function(next) {
    this.populate('products.product');
    next();
});

ticketSchema.pre('findById', function(next) {
    this.populate('products.product');
    next();
});

export const ticketModel = mongoose.model('tickets', ticketSchema);