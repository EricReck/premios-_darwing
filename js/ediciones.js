import { obtenerEdiciones } from './firebase-config.js';

// Elementos del DOM
const edicionesContainer = document.getElementById('ediciones-container');

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
    if (!edicionesContainer) return;
    
    edicionesContainer.innerHTML = '';
    
    if (ediciones.length === 0) {
        edicionesContainer.innerHTML = `
            <div class="mensaje-sistema">
                <i class="fas fa-info-circle"></i>
                <p>No hay ediciones anteriores registradas.</p>
            </div>
        `;
        return;
    }
    
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
        `;
        
        edicionesContainer.appendChild(edicionElement);
    });
}

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