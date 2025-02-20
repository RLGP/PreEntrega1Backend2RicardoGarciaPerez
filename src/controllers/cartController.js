import { cartService } from '../services/cartService.js';

export const getCartById = async (req, res) => {
    try {
        const cart = await cartService.getCartById(req.params.cid);
        res.status(200).json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

export const addProductToCart = async (req, res) => {
    try {
        const cart = await cartService.addProductToCart(req.params.cid, req.params.pid);
        res.status(200).json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

export const purchaseCart = async (req, res) => {
    try {
        console.log('Cart ID:', req.params.cid);
        const ticket = await cartService.purchaseCart(req.params.cid);
        res.status(200).json({ status: 'success', payload: ticket });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};