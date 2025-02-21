async function addToCart(pid) {
    let cartId = localStorage.getItem('cartId');

    if (!cartId) {
        const token = document.cookie.split('=')[1];
        const createCartResponse = await fetch('/api/carts', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const createCart = await createCartResponse.json();

        if (createCart.status === 'error') {
            return alert(createCart.message);
        }

        console.log(createCart);

        cartId = createCart.payload._id;
        localStorage.setItem('cartId', cartId);
    }

    const token = document.cookie.split('=')[1];
    const addProductResponse = await fetch(`/api/carts/${cartId}/product/${pid}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    const addProduct = await addProductResponse.json();

    if (addProduct.status === 'error') {
        return alert(addProduct.message);
    }

    showButtonCart();

    alert('Producto añadido satisfactoriamente!');
}

function showButtonCart() {
    const cartId = localStorage.getItem('cartId');
    const buttonCart = document.querySelector('#button-cart');
    
    if (cartId) {
        buttonCart.setAttribute("href", `/cart/${cartId}`);
    } else {
        buttonCart.setAttribute("href", "#");
        buttonCart.onclick = () => alert('Primero debes agregar productos al carrito');
    }
}
document.addEventListener('DOMContentLoaded', () => {
    showButtonCart();
});