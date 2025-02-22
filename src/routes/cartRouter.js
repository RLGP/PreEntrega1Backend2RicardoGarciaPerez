import { Router } from 'express';
import { productDBManager } from '../dao/productDBManager.js';
import { cartDBManager } from '../dao/cartDBManager.js';
import { ticketRepository } from '../repositories/ticketRepository.js';
import { getCartById, addProductToCart, purchaseCart } from '../services/cartService.js';
import { authorize } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import { ticketSchema } from '../validators/ticketValidator.js';
import * as cartController from '../controllers/cartController.js';
import passport from '../config/passportConfig.js';

const router = Router();
const ProductService = new productDBManager();
const CartService = new cartDBManager(ProductService);

router.get('/:cid', 
    passport.authenticate('jwt', { session: false }), 
    cartController.getCartById
  );
  
router.get('/:cid', async (req, res) => {
    try {
        const result = await getCartById(req.params.cid);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.post('/', async (req, res) => {
    try {
        const result = await CartService.createCart();
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.post('/:cid/product/:pid', 
    passport.authenticate('jwt', { session: false }), 
    cartController.addProductToCart
  );
  
router.post('/:cid/product/:pid', authorize(['user']), async (req, res) => {
    try {
        const result = await addProductToCart(req.params.cid, req.params.pid);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.delete('/:cid/products/:pid',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Usuario no autenticado'
                });
            }

            const result = await CartService.deleteProductByID(req.params.cid, req.params.pid);
            
            return res.status(200).json({
                status: 'success',
                message: 'Producto eliminado del carrito',
                payload: result
            });
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            return res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    }
);

router.put('/:cid', async (req, res) => {
    try {
        const result = await CartService.updateAllProducts(req.params.cid, req.body.products);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.put('/:cid/product/:pid', async (req, res) => {
    try {
        const result = await CartService.updateProductByID(req.params.cid, req.params.pid, req.body.quantity);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.delete('/:cid', async (req, res) => {
    try {
        const result = await CartService.deleteAllProducts(req.params.cid);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.post('/:cid/purchase', 
    passport.authenticate('jwt', { session: false }), 
    authorize(['user']),
    async (req, res) => {
        try {
            const result = await cartController.purchaseCart(req, res);
            return result;
        } catch (error) {
            return res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    }
);

router.post('/:cid/purchase', authorize(['user']), validate(ticketSchema), async (req, res) => {
    try {
        const cart = await getCartById(req.params.cid);
        const insufficientStockProducts = [];
        let totalAmount = 0;

        for (const item of cart.products) {
            const product = await ProductService.getProductByID(item.product._id);
            if (product.stock < item.quantity) {
                insufficientStockProducts.push({
                    productName: product.title,
                    requested: item.quantity,
                    available: product.stock
                });
            }
        }

        if (insufficientStockProducts.length > 0) {
            const errorMessage = insufficientStockProducts
                .map(item => `No hay suficiente stock de: ${item.productName} (Solicitado: ${item.requested}, Disponible: ${item.available})`)
                .join(', ');
            return res.status(400).json({ 
                status: 'error', 
                message: errorMessage
            });
        }

        for (const item of cart.products) {
            const product = await ProductService.getProductByID(item.product._id);
            totalAmount += product.price * item.quantity;
            await ProductService.updateProduct(item.product._id, { 
                stock: product.stock - item.quantity 
            });
        }

        const ticket = await ticketRepository.createTicket({
            amount: totalAmount,
            purchaser: req.user.email,
            products: cart.products
        });

        await CartService.deleteAllProducts(req.params.cid);

        res.status(200).json({ status: 'success', payload: ticket });
    } catch (error) {
        res.status(400).json({ 
            status: 'error', 
            message: 'Error al procesar la compra: ' + error.message 
        });
    }
});
router.get('/ticket/:tid', 
    passport.authenticate('jwt', { session: false }), 
    async (req, res) => {
        try {
            const ticket = await ticketRepository.getTicketById(req.params.tid);
            
            if (!ticket) {
                return res.status(404).json({ 
                    status: 'error', 
                    message: 'Ticket no encontrado' 
                });
            }

            const ticketObject = ticket.toObject();
            
            res.render('ticket', {
                ticket: ticketObject,
                title: 'Ticket de Compra',
                style: 'styles.css'
            });
        } catch (error) {
            console.error('Error al obtener el ticket:', error);
            res.status(500).json({ 
                status: 'error', 
                message: error.message 
            });
        }
    }
);

router.delete('/:cid/products/:pid',
    passport.authenticate('jwt', { session: false }),
    cartController.removeProductFromCart
);
export default router;