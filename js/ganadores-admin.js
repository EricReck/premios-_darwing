import { obtenerGanadores, agregarGanador, eliminarGanador } from './firebase-config.js';

// Elementos del DOM
const ganadoresForm = document.getElementById('ganador-form');
const ganadoresContainer = document.getElementById('ganadores-lista');

// Cargar ganadores al iniciar
document.addEventListener('DOMContentLoaded', cargarGanadores);

// Función para cargar ganadores
async function cargarGanadores() {
    try {
        const ganadores = await obtenerGanadores();
        ganadoresContainer.innerHTML = '';
        
        ganadores.forEach(ganador => {
            const ganadorElement = document.createElement('div');
            ganadorElement.className = 'ganador-item';
            ganadorElement.innerHTML = `
                <div class="ganador-info">
                    <h4>${ganador.nombre}</h4>
                    <p>${ganador.descripcion}</p>
                    <small>Fecha: ${new Date(ganador.fecha.toDate()).toLocaleDateString()}</small>
                </div>
                <button class="btn-eliminar" data-id="${ganador.id}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            
            ganadoresContainer.appendChild(ganadorElement);
        });

        // Agregar event listeners a los botones de eliminar
        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                if (confirm('¿Estás seguro de que deseas eliminar este ganador?')) {
                    try {
                        await eliminarGanador(e.target.closest('.btn-eliminar').dataset.id);
                        mostrarMensaje('Ganador eliminado exitosamente', 'success');
                        cargarGanadores();
                    } catch (error) {
                        mostrarMensaje('Error al eliminar el ganador: ' + error.message, 'error');
                    }
                }
            });
        });
    } catch (error) {
        mostrarMensaje('Error al cargar ganadores: ' + error.message, 'error');
    }
}

// Manejar el envío del formulario
ganadoresForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre-ganador').value;
    const descripcion = document.getElementById('descripcion-ganador').value;
    
    try {
        await agregarGanador({
            nombre,
            descripcion
        });
        
        mostrarMensaje('Ganador agregado exitosamente', 'success');
        ganadoresForm.reset();
        cargarGanadores();
    } catch (error) {
        mostrarMensaje('Error al agregar ganador: ' + error.message, 'error');
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