async function cargarPanel() {
    try {
        document.getElementById('loading').style.display = 'block';
        const [pedidosRes, detallesRes, productosRes] = await Promise.all([
            fetch('./pedidos.json'),
            fetch('./detalles_pedido.json'),
            fetch('./productos.json')
        ]);
        const [pedidos, detalles, productos] = await Promise.all([
            pedidosRes.json(),
            detallesRes.json(),
            productosRes.json()
        ]);

        const pedidosEnriquecidos = pedidos.map(pedido => {
            const dets = detalles.filter(d => d.pedidoId === pedido.id).map(det => ({
                ...det,
                nombreProducto: productos.find(prod => prod.id === det.productoId)?.nombre || 'Desconocido'
            }));
            const totalPedido = dets.reduce((sum, det) => sum + (det.cantidad * det.precioUnitario), 0);
            return { ...pedido, detalles: dets, totalPedido };
        });

        mostrarPanel(pedidosEnriquecidos);
    } catch (e) {
        document.getElementById('pedidos').innerHTML = '<p>Error cargando datos</p>';
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
}

function mostrarPanel(pedidos) {
    const cont = document.getElementById('pedidos');
    cont.innerHTML = pedidos.map(p => `
        <div class="pedido">
            <h3>Pedido ${p.id} - ${p.fecha} (${p.estado})</h3>
            <p><strong>Total: ${p.totalPedido.toFixed(2)} €</strong></p>
            <ul>${p.detalles.map(d => `<li class="detalle">${d.cantidad} x ${d.nombreProducto} - ${d.precioUnitario.toFixed(2)} €</li>`).join('')}</ul>
        </div>
    `).join('');
}

cargarPanel();
