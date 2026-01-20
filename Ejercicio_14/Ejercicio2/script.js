let productos = [];

async function cargarProductos() {
    try {
        const res = await fetch('./productos.json');
        productos = await res.json();
        mostrarProductos();
        mostrarCarrito();
    } catch (e) {
        console.error(e);
    }
}

function mostrarProductos() {
    document.getElementById('productos').innerHTML = productos.map(p => `
        <div class="producto">
            <img src="${p.imagen}" alt="${p.nombre}" style="width:100%;border-radius:4px;">
            <h3>${p.nombre}</h3>
            <p><strong>€${p.precio.toFixed(2)}</strong></p>
            <button onclick="añadirCarrito('${p.id}')">Añadir al Carrito</button>
        </div>
    `).join('');
}

function añadirCarrito(id) {
    let carrito = JSON.parse(localStorage.getItem('carrito') || '{}');
    carrito[id] = (carrito[id] || 0) + 1;
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
}

function mostrarCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito') || '{}');
    const items = Object.entries(carrito);
    const totalItems = items.reduce((sum, [, cant]) => sum + cant, 0);
    document.getElementById('total-items').textContent = totalItems;

    document.getElementById('carrito-items').innerHTML = items.length ? items.map(([id, cant]) => {
        const p = productos.find(pr => pr.id === id);
        return `
            <div class="carrito-item">
                <span>${p.nombre} x${cant}</span>
                <div>
                    <button onclick="cambiarCantidad('${id}', 1)">+</button>
                    <button onclick="cambiarCantidad('${id}', -1)">-</button>
                </div>
            </div>
        `;
    }).join('') : '<p>Carrito vacío</p>';
}

function cambiarCantidad(id, delta) {
    let carrito = JSON.parse(localStorage.getItem('carrito') || '{}');
    if (carrito[id]) {
        carrito[id] += delta;
        if (carrito[id] <= 0) delete carrito[id];
        localStorage.setItem('carrito', JSON.stringify(carrito));
        mostrarCarrito();
    }
}

function vaciarCarrito() {
    localStorage.removeItem('carrito');
    mostrarCarrito();
}

cargarProductos();
