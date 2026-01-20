let productos = [];
let filteredProducts = [];

async function cargarProductos() {
    try {
        const res = await fetch('./productos.json');
        productos = await res.json();
        filteredProducts = [...productos];
        populateCategorias();
        mostrarProductos();
    } catch (e) {
        document.getElementById('loading').textContent = 'Error cargando datos';
    }
}

function populateCategorias() {
    const cats = ['Todas', ...new Set(productos.map(p => p.categoria))];
    const select = document.getElementById('categoriaFilter');
    select.innerHTML = cats.map(cat => `<option>${cat}</option>`).join('');
    select.onchange = filterProductos;
}

function filterProductos() {
    const cat = document.getElementById('categoriaFilter').value;
    filteredProducts = cat === 'Todas' ? [...productos] : productos.filter(p => p.categoria === cat);
    mostrarProductos();
}

function sortProducts(dir) {
    filteredProducts.sort((a, b) => dir === 'asc' ? a.precio - b.precio : b.precio - a.precio);
    mostrarProductos();
}

function mostrarProductos() {
    document.getElementById('loading').style.display = 'none';
    const cont = document.getElementById('productos');
    cont.innerHTML = filteredProducts.map(p => `
        <div class="producto">
            <h3>${p.nombre}</h3>
            <p>Precio: ${p.precio.toFixed(2)} €</p>
            <p>Stock: ${p.stock}</p>
            <p>Categoría: ${p.categoria}</p>
        </div>
    `).join('');
}

cargarProductos();
