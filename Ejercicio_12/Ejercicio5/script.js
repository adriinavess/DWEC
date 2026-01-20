let usuarios = [], productos = [], pedidos = [], detalles = [];

async function cargarDatosIniciales() {
    try {
        document.getElementById('loading').style.display = 'block';
        const [usuariosRes, productosRes, pedidosRes, detallesRes] = await Promise.all([
            fetch('./usuarios.json'),
            fetch('./productos.json'),
            fetch('./pedidos.json'),
            fetch('./detalles_pedido.json')
        ]);
        usuarios = await usuariosRes.json();
        productos = await productosRes.json();
        pedidos = await pedidosRes.json();
        detalles = await detallesRes.json();

        inicializarDashboard();
    } catch (e) {
        document.getElementById('dashboard').innerHTML = '<p>Error cargando datos</p>';
    } finally {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('controls').style.display = 'block';
    }
}

function inicializarDashboard() {
    const select = document.getElementById('usuarioSelect');
    select.innerHTML = '<option value="">Selecciona un usuario</option>' + 
        usuarios.map(u => `<option value="${u.id}">${u.nombre}</option>`).join('');
    select.onchange = e => mostrarDashboardUsuario(parseInt(e.target.value));
}

function mostrarDashboardUsuario(usuarioId) {
    if (!usuarioId) {
        document.getElementById('dashboard').innerHTML = '';
        return;
    }

    const usuario = usuarios.find(u => u.id === usuarioId);
    const userPedidos = pedidos.filter(p => p.usuarioId === usuarioId);

    const pedidosDetallados = userPedidos.map(p => {
        const dets = detalles.filter(d => d.pedidoId === p.id).map(d => ({
            ...d,
            nombreProducto: productos.find(pr => pr.id === d.productoId)?.nombre || 'Desconocido'
        }));
        const total = dets.reduce((s, d) => s + (d.cantidad * d.precioUnitario), 0);
        return { ...p, detalles: dets, total };
    });

    const gastoTotal = pedidosDetallados.reduce((sum, p) => sum + p.total, 0);

    document.getElementById('dashboard').innerHTML = `
        <div class="usuario-panel">
            <h2>${usuario.nombre}</h2>
            <p>Email: ${usuario.email} | Registrado: ${usuario.fechaRegistro}</p>
        </div>
        <div class="pedidos-panel">
            <h3>Pedidos (${pedidosDetallados.length})</h3>
            ${pedidosDetallados.map(p => `
                <div class="pedido-item">
                    <h4>Pedido ${p.id} - ${p.fecha} (${p.estado}) - Total: ${p.total.toFixed(2)} €</h4>
                    <ul>${p.detalles.map(d => `<li class="detalle-item">${d.cantidad}x ${d.nombreProducto} @ ${d.precioUnitario.toFixed(2)}€</li>`).join('')}</ul>
                </div>
            `).join('')}
        </div>
        <div class="resumen">
            <h3>Gasto Total: ${gastoTotal.toFixed(2)} €</h3>
        </div>
    `;
}

cargarDatosIniciales();
