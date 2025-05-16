import { obtenerEdiciones, agregarEdicion, eliminarEdicion } from './firebase-config.js';

// Elementos del DOM
const edicionForm = document.getElementById('edicion-form');
const edicionesLista = document.getElementById('ediciones-lista');
const btnGuardar = document.getElementById('btn-guardar-ediciones');

// Cargar ediciones al iniciar
document.addEventListener('DOMContentLoaded', cargarEdiciones);

// Función para cargar las ediciones
async function cargarEdiciones() {
    try {
        const ediciones = await obtenerEdiciones();
        mostrarEdiciones(ediciones);
    } catch (error) {
        mostrarMensaje('Error al cargar las ediciones: ' + error.message, 'error');
    }
}

// Función para mostrar las ediciones
function mostrarEdiciones(ediciones) {
    edicionesLista.innerHTML = '';
    
    ediciones.forEach(edicion => {
        const edicionElement = document.createElement('div');
        edicionElement.className = 'edicion-item';
        edicionElement.innerHTML = `
            <h4><i class="fas fa-trophy"></i> ${edicion.nombre}</h4>
            <p>${edicion.descripcion}</p>
            <div class="ganadores">
                <h5>Ganadores:</h5>
                <ul>
                    ${edicion.ganadores.map(ganador => `
                        <li><i class="fas fa-medal"></i> ${ganador}</li>
                    `).join('')}
                </ul>
            </div>
            <div class="fecha">
                <i class="far fa-calendar-alt"></i>
                ${new Date(edicion.fecha).toLocaleDateString()}
            </div>
            <button class="btn-eliminar" data-id="${edicion.id}">
                <i class="fas fa-trash-alt"></i>
            </button>
        `;
        
        edicionesLista.appendChild(edicionElement);
    });

    // Agregar event listeners a los botones de eliminar
    document.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.currentTarget.dataset.id;
            if (confirm('¿Estás seguro de que deseas eliminar esta edición?')) {
                try {
                    await eliminarEdicion(id);
                    mostrarMensaje('Edición eliminada exitosamente', 'success');
                    cargarEdiciones();
                } catch (error) {
                    mostrarMensaje('Error al eliminar la edición: ' + error.message, 'error');
                }
            }
        });
    });
}

// Manejar el envío del formulario
edicionForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre-edicion').value;
    const descripcion = document.getElementById('descripcion-edicion').value;
    const ganadores = document.getElementById('ganadores-edicion').value
        .split(',')
        .map(g => g.trim())
        .filter(g => g);

    if (!nombre || !descripcion || ganadores.length === 0) {
        mostrarMensaje('Por favor completa todos los campos', 'error');
        return;
    }

    try {
        await agregarEdicion({
            nombre,
            descripcion,
            ganadores,
            fecha: new Date()
        });

        mostrarMensaje('Edición agregada exitosamente', 'success');
        edicionForm.reset();
        cargarEdiciones();
    } catch (error) {
        mostrarMensaje('Error al agregar la edición: ' + error.message, 'error');
    }
});

// Función para mostrar mensajes
function mostrarMensaje(mensaje, tipo) {
    const mensajeElement = document.createElement('div');
    mensajeElement.className = `mensaje ${tipo}`;
    mensajeElement.textContent = mensaje;
    
    document.body.appendChild(mensajeElement);
    
    setTimeout(() => {
        mensajeElement.remove();
    }, 3000);
} 