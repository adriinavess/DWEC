let db, productos = [];

function initDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open('tiendaDB', 1);
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
        };
    });
}

async function cargarProductos() {
    try {
        document.getElementById('status').textContent = 'Cargando desde IndexedDB...';
        await initDB();
        const tx = db.transaction('productos', 'readonly');
        const store = tx.objectStore('productos');
        const req = store.getAll();
        return new Promise((resolve) => {
            req.onsuccess = () => {
                if (req.result.length) {
                    productos = req.result;
                    document.getElementById('status').textContent = 'Cargado desde caché offline';
                } else {
                    document.getElementById('status').textContent = 'Descargando desde red...';
                    fetch('./productos.json')
                        .then(res => res.json())
                        .then(data => {
                            productos = data;
                            const txWrite = db.transaction('productos', 'readwrite');
                            data.forEach(p => txWrite.objectStore('productos').put(p));
                            document.getElementById('status').textContent = 'Guardado en caché';
                            resolve(productos);
                        }).catch(() => {
                            document.getElementById('status').textContent = 'Error red, sin datos';
                        });
                    return;
                }
                mostrarProductos();
                resolve(productos);
            };
        });
    } catch (e) {
        document.getElementById('status').textContent = 'Error DB: ' + e.message;
    }
}

function mostrarProductos() {
    document.getElementById('productos').innerHTML = productos.map(p => `
        <div class="producto">
            <img src="${p.imagen}" alt="${p.nombre}">
            <h3>${p.nombre}</h3>
            <p>€${p.precio}</p>
        </div>
    `).join('');
}

async function forzarActualizacion() {
    await initDB();
    const tx = db.transaction('productos', 'readwrite');
    tx.objectStore('productos').clear();
    document.getElementById('status').textContent = 'Caché borrado, recargando...';
    cargarProductos();
}

// Auto-cargar
cargarProductos();
