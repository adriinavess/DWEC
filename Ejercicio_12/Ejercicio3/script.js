const form = document.getElementById('productoForm');
const guardarBtn = document.getElementById('guardarBtn');
let skuValido = false;

form.addEventListener('input', validarFormulario);
document.getElementById('sku').addEventListener('blur', validarSkuAsync);

form.addEventListener('submit', e => {
    e.preventDefault();
    const producto = {
        nombre: document.getElementById('nombre').value,
        sku: document.getElementById('sku').value,
        precio: parseFloat(document.getElementById('precio').value),
        stock: parseInt(document.getElementById('stock').value),
        categoria: document.getElementById('categoria').value
    };
    document.getElementById('mensaje').innerHTML = `<div class="success">Producto '${producto.nombre}' guardado correctamente</div>`;
    form.reset();
    guardarBtn.disabled = true;
    skuValido = false;
});

function validarFormulario() {
    const campos = ['nombre', 'sku', 'precio', 'stock', 'categoria'];
    let valido = skuValido;
    campos.forEach(campo => {
        const input = document.getElementById(campo);
        const err = document.getElementById(`err${campo.charAt(0).toUpperCase() + campo.slice(1)}`);
        if (!input.value.trim()) {
            err.textContent = 'Requerido';
            valido = false;
        } else if (campo === 'sku' && input.value.length < 5) {
            err.textContent = 'Mín 5 caracteres';
            valido = false;
        } else if (campo === 'precio' && parseFloat(input.value) <= 0) {
            err.textContent = 'Debe ser > 0';
            valido = false;
        } else if (campo === 'stock' && parseInt(input.value) < 0) {
            err.textContent = 'Debe ser ≥ 0';
            valido = false;
        } else {
            err.textContent = '';
        }
    });
    guardarBtn.disabled = !valido;
}

async function validarSkuAsync() {
    const sku = document.getElementById('sku').value.trim();
    const err = document.getElementById('errSku');
    const validando = document.getElementById('validandoSku');
    if (sku.length < 5) return;

    validando.textContent = 'Validando SKU...';
    try {
        const res = await fetch('./productos.json');
        const productos = await res.json();
        const existe = productos.some(p => p.sku === sku);
        if (existe) {
            err.textContent = 'El SKU ya existe';
            skuValido = false;
        } else {
            err.textContent = '';
            skuValido = true;
        }
    } catch (e) {
        err.textContent = 'Error validando';
        skuValido = false;
    }
    validando.textContent = '';
    validarFormulario();
}
