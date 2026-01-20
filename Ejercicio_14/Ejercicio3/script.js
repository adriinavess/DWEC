let productos = [];

function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

function getCookie(name) {
    return document.cookie.split('; ').reduce((r, v) => {
        const parts = v.split('=');
        return parts[0] === name ? decodeURIComponent(parts[1]) : r;
    }, '');
}

function mostrarBanner() {
    const ultimaVisita = getCookie('ultimaVisita');
    const banner = document.getElementById('banner');
    if (ultimaVisita) {
        banner.innerHTML = `Bienvenido de nuevo. Tu última visita fue: ${ultimaVisita} <button onclick="document.getElementById('banner').style.display='none'">Cerrar ✕</button>`;
        banner.style.display = 'block';
    }
    setCookie('ultimaVisita', new Date().toLocaleString('es-ES'), 30);
}

// resto igual que Ej1: cargarProductos, mostrarProductos
async function cargarProductos() {
    try {
        const res = await fetch('./productos.json');
        productos = await res.json();
        mostrarProductos();
    } catch (e) { console.error(e); }
}

function mostrarProductos() {
    document.getElementById('productos').innerHTML = productos.map(p => `
        <div class="producto">
            <img src="${p.imagen}" alt="${p.nombre}" style="width:100%;">
            <h3>${p.nombre}</h3>
            <p>€${p.precio}</p>
        </div>
    `).join('');
}

// Iniciar
mostrarBanner();
cargarProductos();
