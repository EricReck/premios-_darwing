import { agregarNominacion, obtenerNominaciones, obtenerConfiguracion } from './firebase-config.js';

// Elementos del DOM
const form = document.querySelector('form');
const nominacionesContainer = document.getElementById('nominaciones-container');
const formContainer = document.querySelector('.form-container');

// Función para actualizar el estado del sistema
const actualizarEstadoSistema = async () => {
    try {
        const config = await obtenerConfiguracion();
        formContainer.style.display = 'block';
    } catch (error) {
        console.error('Error al actualizar estado del sistema:', error);
    }
};

// Función para cargar nominaciones activas
const cargarNominacionesActivas = async () => {
    try {
        const nominaciones = await obtenerNominaciones();
        
        // Mostrar solo las 3 nominaciones más recientes
        const nominacionesRecientes = nominaciones.slice(0, 3);
        
        nominacionesContainer.innerHTML = `
            <div class="ver-todas">
                <a href="todas-nominaciones.html" class="btn-ver-todas">
                    <i class="fas fa-list"></i> Ver todas las nominaciones
                </a>
            </div>
            ${nominacionesRecientes
                .map(nominacion => `
                    <div class="nominacion-card fade-in">
                        <h3>
                            <i class="fas fa-trophy"></i>
                            ${nominacion.nombreNominado}
                        </h3>
                        <p>${nominacion.explicacion}</p>
                        <div class="nominacion-footer">
                            <span><i class="fas fa-user"></i> Nominado por: ${nominacion.nominador}</span>
                            <span><i class="fas fa-calendar"></i> ${new Date(nominacion.fecha.toDate()).toLocaleDateString()}</span>
                        </div>
                    </div>
                `)
                .join('')}
        `;
    } catch (error) {
        console.error('Error al cargar nominaciones:', error);
        mostrarMensaje('Error al cargar las nominaciones', 'error');
    }
};

// Función para manejar el envío del formulario
const manejarEnvioFormulario = async (evento) => {
    evento.preventDefault();

    const formData = new FormData(form);
    const nominacion = {
        nombreNominado: formData.get('nombreNominado'),
        explicacion: formData.get('explicacion'),
        nominador: formData.get('nominador'),
        fecha: new Date()
    };

    try {
        await agregarNominacion(nominacion);
        form.reset();
        mostrarMensaje('¡Nominación enviada con éxito!', 'success');
        cargarNominacionesActivas();
    } catch (error) {
        console.error('Error al enviar nominación:', error);
        mostrarMensaje(error.message || 'Error al enviar la nominación. Por favor, intenta de nuevo.', 'error');
    }
};

// Función para mostrar mensajes
const mostrarMensaje = (mensaje, tipo) => {
    const mensajeElement = document.createElement('div');
    mensajeElement.className = `mensaje ${tipo}`;
    mensajeElement.textContent = mensaje;
    
    document.body.appendChild(mensajeElement);
    
    setTimeout(() => {
        mensajeElement.remove();
    }, 3000);
};

// Inicializar la página
document.addEventListener('DOMContentLoaded', () => {
    form.addEventListener('submit', manejarEnvioFormulario);
    actualizarEstadoSistema();
    cargarNominacionesActivas();
}); 
