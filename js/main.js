import { obtenerNominaciones } from './firebase-config.js';

// Función para cargar las nominaciones en la página de inicio
const cargarNominaciones = async () => {
    try {
        const nominaciones = await obtenerNominaciones();
        const container = document.getElementById('nominaciones-container');
        
        if (!container) return;

        container.innerHTML = nominaciones
            .slice(0, 6) // Mostrar solo las 6 más recientes
            .map(nominacion => `
                <div class="nominacion-card fade-in">
                    <h3>${nominacion.nombreNominado}</h3>
                    <p>${nominacion.explicacion}</p>
                    <div class="nominacion-footer">
                        <span>Nominado por: ${nominacion.nominador}</span>
                        <span class="votos">
                            <i class="fas fa-heart"></i> ${nominacion.votos}
                        </span>
                    </div>
                </div>
            `)
            .join('');
    } catch (error) {
        console.error('Error al cargar nominaciones:', error);
    }
};

// Función para inicializar el video
const inicializarVideo = () => {
    const video = document.querySelector('video');
    if (video) {
        video.addEventListener('play', () => {
            video.classList.add('playing');
        });
    }
};

// Función para manejar el scroll y animaciones
const manejarScroll = () => {
    const elementos = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    elementos.forEach(elemento => {
        observer.observe(elemento);
    });
};

// Inicializar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarNominaciones();
    inicializarVideo();
    manejarScroll();
}); 