let db, productos = [];

function initDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open('tiendaDB', 2);
        req.onerror = () => reject(req.error);
        req.onsuccess = () => {
            db = req.result;
            resolve(db);
        };
        req.onupgradeneeded = (e) => {
            db = e.target.result;
            if (!db.objectStoreNames.contains('productos')) {
                db.createObjectStore('productos', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('carrito')) {
                db.createObjectStore('carrito', { keyPath: 'productoId' });
            }
        };
    });
}

async function cargarProductos() {
    await initDB();
    // Cargar productos igual que Ej4...
}

async function añadirCarrito(productoId) {
    await initDB();
    const tx = db.transaction('carrito', 'readwrite');
    const store = tx.objectStore('carrito');
    const getReq = store.get(productoId);
    getReq.onsuccess = () => {
        const item = getReq.result || { productoId, cantidad: 0 };
        item.cantidad++;
        store.put(item);
    };
    mostrarCarrito();
}

async function cambiarCantidad(productoId, delta) {
    await initDB();
    const tx = db.transaction('carrito', 'readwrite');
    const store = tx.objectStore('carrito');
    const getReq = store.get(productoId);
    getReq.onsuccess = () => {
        const item = getReq.result;
        if (item) {
            item.cantidad += delta;
            if (item.cantidad > 0) {
                store.put(item);
            } else {
                store.delete(productoId);
            }
        }
        mostrarCarrito();
    };
}

async function eliminarDelCarrito(productoId) {
    await initDB();
    const tx = db.transaction('carrito', 'readwrite');
    tx.objectStore('carrito').delete(productoId);
    mostrarCarrito();
}

async function mostrarCarrito() {
    await initDB();
    const tx = db.transaction('carrito', 'readonly');
    const store = tx.objectStore('carrito');
    const req = store.getAll();
    req.onsuccess = () => {
        const items = req.result;
        const totalItems = items.reduce((sum, item) => sum + item.cantidad, 0);
        document.getElementById('total-items').textContent = totalItems;
        document.getElementById('carrito-items').innerHTML = items.map(item => {
            const p = productos.find(pr => pr.id === item.productoId);
            return `
                <div class="carrito-item">
                    <span><strong>${p.nombre}</strong> x${item.cantidad}</span>
                    <div>
                        <button class="inc" onclick="cambiarCantidad('${item.productoId}', 1)">+</button>
                        <button class="dec" onclick="cambiarCantidad('${item.productoId}', -1)">-</button>
                        <button class="delete" onclick="eliminarDelCarrito('${item.productoId}')">✕</button>
                    </div>
                </div>
            `;
        }).join('') || '<p>Carrito vacío</p>';
    };
}

function mostrarProductos() {
    // Igual que Ej1/Ej2, pero onclick="añadirCarrito('${p.id}')"
    document.getElementById('productos').innerHTML = productos.map(p => `
        <div class="producto">
            <img src="${p.imagen}" alt="${p.nombre}">
            <h3>${p.nombre}</h3>
            <p>€${p.precio}</p>
            <button onclick="añadirCarrito('${p.id}')">Añadir</button>
        </div>
    `).join('');
}

// Iniciar
cargarProductos();
