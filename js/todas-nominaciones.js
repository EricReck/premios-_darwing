import { obtenerNominaciones } from './firebase-config.js';

// Elementos del DOM
const nominacionesContainer = document.getElementById('todas-nominaciones-container');

// Función para cargar todas las nominaciones
const cargarTodasNominaciones = async () => {
    try {
        const nominaciones = await obtenerNominaciones();
        
        nominacionesContainer.innerHTML = nominaciones
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
            .join('');
    } catch (error) {
        console.error('Error al cargar nominaciones:', error);
        mostrarMensaje('Error al cargar las nominaciones', 'error');
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
    cargarTodasNominaciones();
}); 