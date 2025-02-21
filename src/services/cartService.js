import { cartDBManager } from '../dao/cartDBManager.js';
import { productDBManager } from '../dao/productDBManager.js';
import { ticketDBManager } from '../dao/ticketDBManager.js';

const productManager = new productDBManager();

const CartService = new cartDBManager(productManager);
const TicketService = new ticketDBManager();

export const getCartById = async (cid) => {
    return await CartService.getProductsFromCartByID(cid);
};

export const addProductToCart = async (cid, pid) => {
    return await CartService.addProductByID(cid, pid);
};
  
export const purchaseCart = async (cid, user) => {
  if (!user || !user.email) {
      throw new Error('Usuario no válido');
  }

  const cart = await CartService.getProductsFromCartByID(cid);
  const insufficientStock = [];
  let totalAmount = 0;
    for (const item of cart.products) {
      // Usa la instancia productManager para llamar a los métodos
      const product = await productManager.getProductByID(item.product._id);
      if (product.stock < item.quantity) {
        insufficientStock.push(product._id);
      } else {
        totalAmount += product.price * item.quantity;
        await productManager.updateProduct(item.product._id, { stock: product.stock - item.quantity });
      }
    }
    if (insufficientStock.length > 0) {
      return { status: 'error', message: 'Stock insuficiente para algunos productos', insufficientStock };
    }
    const ticket = await TicketService.createTicket({
      amount: totalAmount,
      purchaser: user.email,
      products: cart.products
  });

  await CartService.deleteAllProducts(cid);
  return ticket;
};