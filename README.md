# Premios Darwing

Sistema de nominaciones y votaciones para los Premios Darwing.

## Estructura del Proyecto

```
premios-darwing/
├── index.html              # Página principal
├── nominaciones.html       # Página de nominaciones
├── todas-nominaciones.html # Lista completa de nominaciones
├── votar.html             # Página de votación
├── admin.html             # Panel de administración
├── ediciones.html         # Ediciones anteriores
├── js/
│   ├── config.js          # Configuración de Firebase
│   ├── firebase-config.js # Funciones de Firebase
│   ├── admin.js           # Lógica del panel de administración
│   ├── main.js            # Lógica principal
│   ├── menu.js            # Control del menú móvil
│   └── avisos-sistema.js  # Sistema de notificaciones
├── css/
│   └── styles.css         # Estilos de la aplicación
└── assets/                # Imágenes y recursos
```

## Configuración

1. Clona el repositorio:
```bash
git clone https://github.com/TU-USUARIO/premios-darwing.git
```

2. Abre el proyecto en tu editor de código favorito.

3. Configura Firebase:
   - Crea un proyecto en [Firebase Console](https://console.firebase.google.com)
   - Habilita Firestore Database
   - Copia las credenciales en `js/config.js`

4. Despliega en GitHub Pages:
   - Sube el código a tu repositorio
   - Activa GitHub Pages en la configuración del repositorio
   - El sitio estará disponible en `https://TU-USUARIO.github.io/premios-darwing`

## Características

- Sistema de nominaciones
- Sistema de votaciones
- Panel de administración
- Gestión de ganadores
- Diseño responsive
- Notificaciones del sistema

## Tecnologías Utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- Firebase (Firestore)
- GitHub Pages 