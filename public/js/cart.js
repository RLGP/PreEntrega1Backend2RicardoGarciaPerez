function finalizePurchase() {
  const pathname = window.location.pathname;
  const parts = pathname.split('/');
  const cid = parts[2];
  const token = document.cookie.split('=')[1]; // Obtener el token

  if (!cid) {
      alert('No se encontró el ID del carrito');
      return;
  }

  fetch(`/api/carts/${cid}/purchase`, {
      method: 'POST',
      credentials: 'include',
      headers: {
          'Authorization': `Bearer ${token}`, // Agregar el token
          'Content-Type': 'application/json'
      }
  })
  .then(response => response.json())
  .then(data => {
      if (data.status === 'success') {
          alert('Compra finalizada con éxito');
          window.location.href = '/products'; // Redirigir después de la compra
      } else {
          alert('Error al finalizar la compra: ' + data.message);
      }
  })
  .catch(error => {
      console.error(error);
      alert('Error al procesar la compra');
  });
}