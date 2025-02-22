import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'users',    
        required: true 
    },
    products: [{
        product: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'products'  
        },
        quantity: { 
          type: Number, 
          default: 1 
        }
    }]
});

const cartModel = mongoose.model('carts', cartSchema); 
export { cartModel };