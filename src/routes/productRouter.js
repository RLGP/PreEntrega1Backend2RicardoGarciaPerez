import { Router } from 'express';
import { productDBManager } from '../dao/productDBManager.js';
import { uploader } from '../utils/multerUtil.js';
import { authorize } from '../middleware/authMiddleware.js';
import passport from '../config/passportConfig.js';
import { productController } from '../controllers/productController.js';

const router = Router();
const ProductService = new productDBManager();

router.get('/', async (req, res) => {
    const result = await ProductService.getAllProducts(req.query);

    res.send({
        status: 'success',
        payload: result
    });
});

router.get('/:pid', async (req, res) => {
    try {
        const result = await ProductService.getProductByID(req.params.pid);
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

router.post('/', authorize(['admin']), uploader.array('thumbnails', 3), async (req, res) => {
    if (req.files) {
        req.body.thumbnails = [];
        req.files.forEach((file) => {
            req.body.thumbnails.push(file.path);
        });
    }

    try {
        const result = await ProductService.createProduct(req.body);
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

router.put('/:pid', authorize(['admin']), uploader.array('thumbnails', 3), async (req, res) => {
    if (req.files) {
        req.body.thumbnails = [];
        req.files.forEach((file) => {
            req.body.thumbnails.push(file.filename);
        });
    }

    try {
        const result = await ProductService.updateProduct(req.params.pid, req.body);
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

router.delete('/:pid', authorize(['admin']), async (req, res) => {
    try {
        const result = await ProductService.deleteProduct(req.params.pid);
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
router.put('/:pid/stock', 
    passport.authenticate('jwt', { session: false }),
    authorize(['admin']),
    async (req, res) => {
      const { pid } = req.params;
      const { stock } = req.body;
      try {
        const updatedProduct = await productController.updateProductStock(pid, stock);
        res.status(200).json({ status: 'success', payload: updatedProduct });
      } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
      }
  });
export default router;