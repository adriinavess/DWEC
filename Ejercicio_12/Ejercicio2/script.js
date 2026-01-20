document.getElementById('searchForm').addEventListener('submit', async e => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    if (!email || !email.includes('@')) {
        document.getElementById('resultados').innerHTML = '<p class="error">Email inválido</p>';
        return;
    }
    document.getElementById('loading').style.display = 'block';
    try {
        const [usuariosRes, pedidosRes] = await Promise.all([
            fetch('./usuarios.json'),
            fetch('./pedidos.json')
        ]);
        const usuarios = await usuariosRes.json();
        const pedidos = await pedidosRes.json();

        const usuario = usuarios.find(u => u.email === email);
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }

        const userPedidos = pedidos.filter(p => p.usuarioId === usuario.id);
        mostrarResultados(usuario, userPedidos);
    } catch (e) {
        document.getElementById('resultados').innerHTML = `<p class="error">${e.message}</p>`;
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
});

function mostrarResultados(usuario, pedidos) {
    const html = `
        <div class="usuario-info">
            <h3>${usuario.nombre}</h3>
            <p>Email: ${usuario.email}</p>
            <p>Registrado: ${usuario.fechaRegistro}</p>
        </div>
        ${pedidos.length ? pedidos.map(p => `<div class="pedido"><h4>Pedido ${p.id} - ${p.fecha} (${p.estado})</h4></div>`).join('') : '<p>Este usuario no tiene pedidos</p>'}
    `;
    document.getElementById('resultados').innerHTML = html;
}
