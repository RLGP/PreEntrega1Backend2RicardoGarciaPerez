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
      throw new Error('Usuario inválido');
  }

  const cart = await CartService.getProductsFromCartByID(cid);
  if (!cart || !cart.products || cart.products.length === 0) {
      throw new Error('Carrito vacío o inválido');
  }

  const insufficientStockProducts = [];
  let totalAmount = 0;

  // Verificar stock de todos los productos primero
  for (const item of cart.products) {
      const product = await productManager.getProductByID(item.product._id);
      if (!product) {
          throw new Error(`Producto no encontrado: ${item.product._id}`);
      }
      if (product.stock < item.quantity) {
          insufficientStockProducts.push({
              title: product.title,
              requested: item.quantity,
              available: product.stock
          });
      }
  }

  if (insufficientStockProducts.length > 0) {
      const errorMessage = insufficientStockProducts
          .map(p => `${p.title} (Pedido: ${p.requested}, Disponible: ${p.available})`)
          .join(', ');
      throw new Error(`Stock insuficiente para: ${errorMessage}`);
  }

  // Procesar la compra
  for (const item of cart.products) {
      const product = await productManager.getProductByID(item.product._id);
      totalAmount += product.price * item.quantity;
      await productManager.updateProduct(item.product._id, {
          stock: product.stock - item.quantity
      });
  }

  const ticket = await TicketService.createTicket({
      amount: totalAmount,
      purchaser: user.email,
      products: cart.products
  });

  await CartService.deleteAllProducts(cid);
  return ticket;
};
