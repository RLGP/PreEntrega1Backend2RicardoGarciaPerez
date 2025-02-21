// public/js/cart.js
function finalizePurchase() {
    // Se asume que la URL de la página es "/cart/<cid>"
    const pathname = window.location.pathname; // ej: "/cart/67b0f2c986e5059777e710ea"
    const parts = pathname.split('/');
    // parts[0] = "" (por la barra inicial)
    // parts[1] = "cart"
    // parts[2] = "<cid>"
    const cid = parts[2] || '';
    console.log('Finalizing purchase for cart ID:', cid);
  
    if (!cid) {
      alert('No se encontró el ID del carrito');
      return;
    }
  
    // La ruta correcta es: /api/carts/<cid>/purchase
    fetch(`/api/carts/${cid}/purchase`, {
      method: 'POST',
      credentials: 'include', // para enviar cookies si se usan
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log('Compra finalizada:', data);
        // Aquí puedes redirigir o mostrar un mensaje de éxito
      })
      .catch(error => console.error(error));
  }