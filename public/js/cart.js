function finalizePurchase() {
    const pathname = window.location.pathname;
    const parts = pathname.split('/');
    const cid = parts[2];
    const token = document.cookie.split('=')[1];

    if (!cid) {
        alert('No se encontró el ID del carrito');
        return;
    }

    fetch(`/api/carts/${cid}/purchase`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {

            window.location.href = `/api/carts/ticket/${data.payload._id}`;
        } else {
            alert('Error al finalizar la compra: ' + data.message);
        }
    })
    .catch(error => {
        console.error(error);
        alert('Error al procesar la compra');
    });
}