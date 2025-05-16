import { obtenerConfiguracion } from './firebase-config.js';

// Función para mostrar avisos del sistema
export function mostrarAvisoSistema() {
    // Eliminar avisos existentes
    const avisosExistentes = document.querySelectorAll('.aviso-sistema');
    avisosExistentes.forEach(aviso => aviso.remove());

    // Obtener configuración del sistema
    obtenerConfiguracion().then(config => {
        // Crear aviso de nominaciones
        const avisoNominaciones = document.createElement('div');
        avisoNominaciones.className = `aviso-sistema nominaciones ${config.nominacionesActivas ? '' : 'cerrado'}`;
        avisoNominaciones.innerHTML = `
            <i class="fas ${config.nominacionesActivas ? 'fa-check-circle' : 'fa-times-circle'}"></i>
            <p>${config.mensajeSistema || (config.nominacionesActivas ? 'Las nominaciones están abiertas' : 'Las nominaciones están cerradas')}</p>
        `;
        document.body.appendChild(avisoNominaciones);

        // Crear aviso de votaciones
        const avisoVotaciones = document.createElement('div');
        avisoVotaciones.className = `aviso-sistema votaciones ${config.votacionesActivas ? '' : 'cerrado'}`;
        avisoVotaciones.style.top = '140px'; // Posicionar debajo del aviso de nominaciones
        avisoVotaciones.innerHTML = `
            <i class="fas ${config.votacionesActivas ? 'fa-check-circle' : 'fa-times-circle'}"></i>
            <p>${config.mensajeVotaciones || (config.votacionesActivas ? 'Las votaciones están abiertas' : 'Las votaciones están cerradas')}</p>
        `;
        document.body.appendChild(avisoVotaciones);

        // Eliminar avisos después de 5 segundos
        setTimeout(() => {
            avisoNominaciones.style.opacity = '0';
            avisoVotaciones.style.opacity = '0';
            setTimeout(() => {
                avisoNominaciones.remove();
                avisoVotaciones.remove();
            }, 500);
        }, 5000);
    }).catch(error => {
        console.error('Error al obtener la configuración:', error);
    });
}

// Mostrar avisos al cargar la página
document.addEventListener('DOMContentLoaded', mostrarAvisoSistema); 