import * as cartService from '../services/cartService.js';

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
      if (!req.user) {
          return res.status(401).json({
              status: 'error',
              message: 'Usuario no autenticado'
          });
      }

      const result = await cartService.purchaseCart(req.params.cid, req.user);
      
      return res.status(200).json({
          status: 'success',
          payload: result
      });
  } catch (error) {
      console.error('Error en purchaseCart:', error);
      return res.status(400).json({
          status: 'error',
          message: error.message
      });
  }
};

export const cartController = {
    addProductToCart: async (req, res) => {
      try {
        if (!req.user) {
          return res.status(401).send({ status: 'error', message: 'No autenticado' });
        }
        const { cid, pid } = req.params;
        const result = await cartService.addProductToCart(cid, pid);
        return res.status(200).send({ status: 'success', payload: result });
      } catch (error) {
        return res.status(400).send({ status: 'error', message: error.message });
      }
    },
    
    getCartById: async (req, res) => {
      try {
        const { cid } = req.params;
        const result = await cartService.getCartById(cid);
        return res.status(200).send({ status: 'success', payload: result });
      } catch (error) {
        return res.status(400).send({ status: 'error', message: error.message });
      }
    }
};

export const removeProductFromCart = async (req, res) => {
  try {
      const { cid, pid } = req.params;
      const result = await cartService.removeProductFromCart(cid, pid);
      res.status(200).json({ 
          status: 'success', 
          message: 'Producto eliminado del carrito',
          payload: result 
      });
  } catch (error) {
      res.status(400).json({ 
          status: 'error', 
          message: error.message 
      });
  }
};