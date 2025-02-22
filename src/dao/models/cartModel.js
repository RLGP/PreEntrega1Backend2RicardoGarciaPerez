import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'users',        // Cambiado de 'User' a 'users'
        required: true 
    },
    products: [{
        product: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'products'    // Cambiado de 'Product' a 'products'
        },
        quantity: { 
          type: Number, 
          default: 1 
        }
    }]
});

const cartModel = mongoose.model('carts', cartSchema); // Cambiado de 'Cart' a 'carts'
export { cartModel };