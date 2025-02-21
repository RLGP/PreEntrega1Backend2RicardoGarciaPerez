import mongoose from 'mongoose';

const cartCollection = 'carts';

const cartSchema = new mongoose.Schema({
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: Number
        }
    ],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Asegúrate de que esté definida así
});

const cartModel = mongoose.model('Cart', cartSchema);
export { cartModel };