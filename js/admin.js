import { obtenerConfiguracion, actualizarConfiguracion, obtenerNominaciones, eliminarNominacion } from './firebase-config.js';

// Elementos del DOM
const toggleNominaciones = document.getElementById('toggleNominaciones');
const toggleVotaciones = document.getElementById('toggleVotaciones');
const mensajeSistema = document.getElementById('mensajeSistema');
const mensajeVotaciones = document.getElementById('mensajeVotaciones');
const btnGuardar = document.getElementById('btnGuardar');
const estadoNominaciones = document.getElementById('estadoNominaciones');
const estadoVotaciones = document.getElementById('estadoVotaciones');
const totalNominaciones = document.getElementById('totalNominaciones');
const totalVotos = document.getElementById('totalVotos');
const nominacionesContainer = document.getElementById('nominacionesContainer');

// Cargar configuración al iniciar
document.addEventListener('DOMContentLoaded', () => {
    cargarConfiguracion();
    cargarNominaciones();
});

// Función para cargar la configuración
async function cargarConfiguracion() {
    try {
        const config = await obtenerConfiguracion();
        
        // Actualizar toggles
        toggleNominaciones.checked = config.nominacionesActivas;
        toggleVotaciones.checked = config.votacionesActivas;
        
        // Actualizar mensajes
        mensajeSistema.value = config.mensajeSistema || '';
        mensajeVotaciones.value = config.mensajeVotaciones || '';
        
        // Actualizar estados
        actualizarEstados(config);
        
        // Cargar estadísticas
        cargarEstadisticas();
    } catch (error) {
        mostrarMensaje('Error al cargar la configuración: ' + error.message, 'error');
    }
}

// Función para cargar nominaciones
async function cargarNominaciones() {
    try {
        const nominaciones = await obtenerNominaciones();
        nominacionesContainer.innerHTML = '';
        
        nominaciones.forEach(nominacion => {
            const nominacionElement = document.createElement('div');
            nominacionElement.className = 'nominacion-item';
            nominacionElement.innerHTML = `
                <div class="nominacion-info">
                    <h4>${nominacion.nombre}</h4>
                    <p>${nominacion.explicacion}</p>
                    <small>Nominado por: ${nominacion.nominador}</small>
                </div>
                <button class="btn-eliminar" data-id="${nominacion.id}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            
            nominacionesContainer.appendChild(nominacionElement);
        });

        // Agregar event listeners a los botones de eliminar
        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                if (confirm('¿Estás seguro de que deseas eliminar esta nominación?')) {
                    try {
                        await eliminarNominacion(e.target.closest('.btn-eliminar').dataset.id);
                        mostrarMensaje('Nominación eliminada exitosamente', 'success');
                        cargarNominaciones();
                        cargarEstadisticas();
                    } catch (error) {
                        mostrarMensaje('Error al eliminar la nominación: ' + error.message, 'error');
                    }
                }
            });
        });
    } catch (error) {
        mostrarMensaje('Error al cargar nominaciones: ' + error.message, 'error');
    }
}

// Función para actualizar estados
function actualizarEstados(config) {
    estadoNominaciones.textContent = config.nominacionesActivas ? 'Activas' : 'Inactivas';
    estadoVotaciones.textContent = config.votacionesActivas ? 'Activas' : 'Inactivas';
}

// Función para cargar estadísticas
async function cargarEstadisticas() {
    try {
        const nominaciones = await obtenerNominaciones();
        const totalVotosCount = nominaciones.reduce((sum, nom) => sum + (nom.votos || 0), 0);
        
        totalNominaciones.textContent = nominaciones.length;
        totalVotos.textContent = totalVotosCount;
    } catch (error) {
        console.error('Error al cargar estadísticas:', error);
    }
}

// Manejar el guardado de la configuración
btnGuardar.addEventListener('click', async () => {
    try {
        const nuevaConfig = {
            nominacionesActivas: toggleNominaciones.checked,
            votacionesActivas: toggleVotaciones.checked,
            mensajeSistema: mensajeSistema.value,
            mensajeVotaciones: mensajeVotaciones.value
        };
        
        await actualizarConfiguracion(nuevaConfig);
        actualizarEstados(nuevaConfig);
        mostrarMensaje('Configuración guardada exitosamente', 'success');
    } catch (error) {
        mostrarMensaje('Error al guardar la configuración: ' + error.message, 'error');
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