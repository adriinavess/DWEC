let productos = [];

async function cargarProductos() {
    try {
        const res = await fetch('./productos.json');
        productos = await res.json();
        mostrarProductos();
    } catch (e) {
        document.getElementById('productos').innerHTML = '<p>Error cargando productos</p>';
        console.error(e);
    }
}

function mostrarProductos() {
    const contenedor = document.getElementById('productos');
    contenedor.innerHTML = productos.map(p => `
        <div class="producto">
            <img src="${p.imagen}" alt="${p.nombre}" style="width:100%; border-radius:4px;">
            <h3>${p.nombre}</h3>
            <p><strong>€${p.precio.toFixed(2)}</strong></p>
        </div>
    `).join('');
}

function cambiarTema(tema) {
    const root = document.documentElement;
    sessionStorage.setItem('tema', tema);
    if (tema === 'oscuro') {
        root.style.setProperty('--bg', '#1a1a1a');
        root.style.setProperty('--txt', '#ffffff');
        root.style.setProperty('--card-bg', '#2d2d2d');
        root.style.setProperty('--border', '#444');
    } else {
        root.style.setProperty('--bg', 'white');
        root.style.setProperty('--txt', 'black');
        root.style.setProperty('--card-bg', '#f8f9fa');
        root.style.setProperty('--border', '#dee2e6');
    }
}

// Aplicar tema guardado al cargar
const temaGuardado = sessionStorage.getItem('tema');
if (temaGuardado) cambiarTema(temaGuardado);

// Iniciar app
cargarProductos();
