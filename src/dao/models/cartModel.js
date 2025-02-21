import mongoose from 'mongoose';

const cartCollection = 'carts';

const cartSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',        // Asegúrate que el modelo de usuario se registre con el nombre "User"
        required: true 
      },
      products: [{
        product: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'Product' 
        },
        quantity: { 
          type: Number, 
          default: 1 
        }
      }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Asegúrate de que esté definida así
});

const cartModel = mongoose.model('Cart', cartSchema);
export { cartModel };