import { cartModel } from "./models/cartModel.js";

class cartDBManager {

    constructor(productDBManager) {
        this.productDBManager = productDBManager;
    }

    async getAllCarts() {
        return cartModel.find();
    }

    async getProductsFromCartByID(cid) {
        const cart = await cartModel.findOne({_id: cid})
            .populate('products.product')
            .populate('user');
        
        if (!cart) throw new Error(`El carrito ${cid} no existe!`);
        return cart;
    }

    async createCart(userId) {
        try {
            const newCart = await cartModel.create({
                products: [],
                user: userId
            });
            return newCart;
        } catch (error) {
            throw new Error(`Error al crear carrito: ${error.message}`);
        }
    }

    async addProductByID(cid, pid) {
        await this.productDBManager.getProductByID(pid);

        const cart = await cartModel.findOne({ _id: cid});

        if (!cart) throw new Error(`El carrito ${cid} no existe!`);
    
        let i = null;
        const result = cart.products.filter(
            (item, index) => {
                if (item.product.toString() === pid) i = index;
                return item.product.toString() === pid;
            }
        );

        if (result.length > 0) {
            cart.products[i].quantity += 1;
        } else {
            cart.products.push({
                product: pid,
                quantity: 1
            });
        }
        await cartModel.updateOne({ _id: cid }, { products: cart.products});

        return await this.getProductsFromCartByID(cid);
    }

    async deleteProductByID(cid, pid) {
        try {
            const cart = await cartModel.findById(cid);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
    
            const productIndex = cart.products.findIndex(
                item => item.product.toString() === pid
            );
    
            if (productIndex === -1) {
                throw new Error('Producto no encontrado en el carrito');
            }
    
            cart.products.splice(productIndex, 1);
            
            const updatedCart = await cartModel.findByIdAndUpdate(
                cid,
                { products: cart.products },
                { new: true, runValidators: false }
            );
    
            return updatedCart.products;
        } catch (error) {
            throw new Error(`Error al eliminar producto: ${error.message}`);
        }
    }

    async updateAllProducts(cid, products) {

        for (let key in products) {
            await this.productDBManager.getProductByID(products[key].product);
        }

        await cartModel.updateOne({ _id: cid }, { products: products });
        
        return await this.getProductsFromCartByID(cid)
    }

    async updateProductByID(cid, pid, quantity) {

        if (!quantity || isNaN(parseInt(quantity))) throw new Error(`La cantidad ingresada no es válida!`);

        await this.productDBManager.getProductByID(pid);

        const cart = await cartModel.findOne({ _id: cid});

        if (!cart) throw new Error(`El carrito ${cid} no existe!`);
    
        let i = null;
        const result = cart.products.filter(
            (item, index) => {
                if (item.product.toString() === pid) i = index;
                return item.product.toString() === pid;
            }
        );

        if (result.length === 0) throw new Error(`El producto ${pid} no existe en el carrito ${cid}!`);

        cart.products[i].quantity = parseInt(quantity);

        await cartModel.updateOne({ _id: cid }, { products: cart.products});

        return await this.getProductsFromCartByID(cid);
    }

    async deleteAllProducts(cid) {

        await cartModel.updateOne({ _id: cid }, { products: [] });
        
        return await this.getProductsFromCartByID(cid)
    }
}

export { cartDBManager };