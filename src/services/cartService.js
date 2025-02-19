import { cartDBManager } from '../dao/cartDBManager.js';
import { productDBManager } from '../dao/productDBManager.js';
import { ticketDBManager } from '../dao/ticketDBManager.js';

const CartService = new cartDBManager(new productDBManager());
const TicketService = new ticketDBManager();

export const getCartById = async (cid) => {
    return await CartService.getProductsFromCartByID(cid);
};

export const addProductToCart = async (cid, pid) => {
    return await CartService.addProductByID(cid, pid);
};

export const purchaseCart = async (cid) => {
    const cart = await CartService.getProductsFromCartByID(cid);
    const insufficientStock = [];
    let totalAmount = 0;

    for (const item of cart.products) {
        const product = await productDBManager.getProductByID(item.product._id);
        if (product.stock < item.quantity) {
            insufficientStock.push(product._id);
        } else {
            totalAmount += product.price * item.quantity;
            await productDBManager.updateProduct(item.product._id, { stock: product.stock - item.quantity });
        }
    }

    if (insufficientStock.length > 0) {
        return { status: 'error', message: 'Insufficient stock for some products', insufficientStock };
    }

    const ticket = await TicketService.createTicket({
        amount: totalAmount,
        purchaser: cart.user.email,
        products: cart.products
    });

    await CartService.deleteAllProducts(cid);

    return ticket;
};