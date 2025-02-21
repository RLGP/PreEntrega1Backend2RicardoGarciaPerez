import productModel from '../dao/models/productModel.js';

export const productController = {
  updateProductStock: async (pid, newStock) => {
    return await productModel.findByIdAndUpdate(pid, { stock: newStock }, { new: true });
  }
};