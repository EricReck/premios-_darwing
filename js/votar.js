import { obtenerNominaciones, agregarVoto, obtenerConfiguracion } from './firebase-config.js';

// Elementos del DOM
const form = document.getElementById('votacionForm');
const nominacionesContainer = document.getElementById('nominaciones-votacion');
const nombreVotante = document.getElementById('nombreVotante');

// Función para cargar nominaciones para votar
const cargarNominacionesVotacion = async () => {
    try {
        const nominaciones = await obtenerNominaciones();
        const config = await obtenerConfiguracion();

        if (!config.votacionesActivas) {
            nominacionesContainer.innerHTML = `
                <div class="mensaje-sistema error">
                    <i class="fas fa-times-circle"></i>
                    <p>${config.mensajeVotaciones || 'Las votaciones están cerradas en este momento.'}</p>
                </div>
            `;
            form.style.display = 'none';
            return;
        }
        
        if (nominaciones.length === 0) {
            nominacionesContainer.innerHTML = `
                <div class="mensaje-sistema">
                    <i class="fas fa-info-circle"></i>
                    <p>No hay nominaciones disponibles para votar en este momento.</p>
                </div>
            `;
            return;
        }

        nominacionesContainer.innerHTML = nominaciones
            .map(nominacion => `
                <div class="nominacion-voto">
                    <div class="nominacion-info">
                        <h3>
                            <i class="fas fa-trophy"></i>
                            ${nominacion.nombreNominado}
                        </h3>
                        <p>${nominacion.explicacion}</p>
                        <div class="nominacion-footer">
                            <span><i class="fas fa-user"></i> Nominado por: ${nominacion.nominador}</span>
                        </div>
                    </div>
                    <div class="voto-checkbox">
                        <input type="checkbox" 
                               id="voto-${nominacion.id}" 
                               name="votos" 
                               value="${nominacion.id}"
                               class="voto-input">
                        <label for="voto-${nominacion.id}">Votar</label>
                    </div>
                </div>
            `)
            .join('');

        // Agregar validación de máximo 2 votos
        const checkboxes = document.querySelectorAll('.voto-input');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const checkedBoxes = document.querySelectorAll('.voto-input:checked');
                if (checkedBoxes.length > 1) {
                    checkbox.checked = false;
                    mostrarMensaje('Solo puedes votar por un máximo de 1 nominación', 'error');
                }
            });
        });
    } catch (error) {
        console.error('Error al cargar nominaciones:', error);
        mostrarMensaje('Error al cargar las nominaciones', 'error');
    }
};

// Función para manejar el envío del formulario
const manejarEnvioFormulario = async (evento) => {
    evento.preventDefault();

    const votosSeleccionados = document.querySelectorAll('.voto-input:checked');
    if (votosSeleccionados.length === 0) {
        mostrarMensaje('Debes seleccionar al menos una nominación', 'error');
        return;
    }

    try {
        for (const voto of votosSeleccionados) {
            await agregarVoto(voto.value, nombreVotante.value);
        }
        
        form.reset();
        mostrarMensaje('¡Votos registrados con éxito!', 'success');
        setTimeout(() => {
            window.location.href = 'nominaciones.html';
        }, 2000);
    } catch (error) {
        console.error('Error al enviar votos:', error);
        mostrarMensaje(error.message || 'Error al registrar los votos', 'error');
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
    cargarNominacionesVotacion();
}); 
