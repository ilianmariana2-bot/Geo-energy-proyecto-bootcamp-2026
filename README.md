# GeoEnergy - Plataforma Educativa de Energía Geotérmica

Sitio web interactivo dedicado a divulgar, educar y ofrecer herramientas especializadas sobre energía geotérmica. Recursos técnicos, calculadoras interactivas y dashboards analíticos para estudiantes y profesionales.

## Características Principales

- **Carrusel interactivo** con contenido sobre plantas geotérmicas, recursos naturales y tecnologías modernas
- **Dashboard analítico** con gráficos de producción global, distribución de sistemas y evolución de capacidad
- **Calculadora de consumo** para estimar producción en TWh, emisiones de CO2 evitadas y costos
- **Diseño responsivo** optimizado para móvil, tablet y desktop
- **Interfaz oscura moderna** con paleta de colores naranja y gris (tema geotérmico)
- **Navegación accesible** con soporte de teclado y atributos ARIA

## Estructura del Proyecto

```
Proyecto Tech - Energia Geotermica/
├── index.html                          # Página principal con carrusel y descripción
├── src/
│   ├── views/
│   │   ├── dashboard.html             # Dashboard con gráficos de datos
│   │   └── calculadora.html           # Calculadora de consumo geotérmico
│   └── services/
│       ├── script.js                  # Lógica compartida (toggle de navegación)
│       ├── carrousel.js               # Carrusel con autoplay y navegación
│       ├── dashboard.js               # Inicialización de gráficos (Chart.js)
│       └── calculadora.js             # Lógica de cálculos y gráficos comparativos
├── assets/
│   ├── img/                           # Imágenes y SVGs del proyecto
│   └── styles/
│       ├── style.css                  # Estilos globales y variables CSS
│       ├── header.css                 # Estilos del header y navegación
│       ├── toggle.css                 # Estilos del menú toggle móvil
│       ├── carrousel.css              # Estilos del carrusel responsivo
│       ├── footer.css                 # Estilos del footer
│       ├── dashboard.css              # Estilos del dashboard
│       └── calculadora.css            # Estilos de la calculadora
└── README.md                          # Este archivo
```

## Tecnologías Utilizadas

### Frontend
- **HTML5** - Estructura semántica
- **CSS3** - Diseño responsivo con variables CSS, clamp() y media queries
- **Vanilla JavaScript** - Sin dependencias (salvo librerías externas)

### Librerías Externas
- **Bootstrap 5.3.8** - Framework CSS para grid y utilidades
- **Chart.js 4.4.0** - Gráficos interactivos (Dashboard)
- **Font Awesome 6.4.2** - Iconos (Dashboard y Calculadora)
- **SweetAlert2** - Alertas personalizadas (Calculadora)
- **Google Fonts (Quicksand)** - Tipografía personalizada

## Instalación y Uso

### Opción 1: Abrir directamente en navegador
1. Clona o descarga el repositorio
2. Navega a la carpeta del proyecto
3. Abre `index.html` con tu navegador (o usa Live Server en VS Code)

### Opción 2: Con Live Server (VS Code)
```bash
# Instala la extensión "Live Server" en VS Code
# Haz clic derecho en index.html > "Open with Live Server"
```

### Requisitos
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Conexión a internet (para CDN de Bootstrap, Chart.js, Font Awesome)

## Características por Página

### Página Principal (`index.html`)
- **Carrusel automático** con 3 slides sobre geotermia (autoplay cada 6 segundos)
- **Navegación manual** con flechas y soporte de teclado (Arrow Left/Right)
- **Overlay informativo** en cada slide con fondo naranja semitransparente
- **Sección educativa** con video de YouTube embebido
- **Tarjetas de ventajas/desventajas** con iconos y contenido organizado
- **Centrado vertical** automático en pantallas grandes (≥ 1024px)

### Dashboard (`src/views/dashboard.html`)
- **Gráfico de barras** - Producción de energía por país (TWh)
- **Gráfico circular (Pie)** - Distribución de tipos de sistemas geotérmicos
- **Gráfico de líneas** - Evolución de capacidad 2018-2024
- **Tarjetas de estadísticas** - Producción global, consumo mundial, capacidad instalada, empleos
- **Responsivo** - Se adapta automáticamente a móvil, tablet y desktop

### Calculadora (`src/views/calculadora.html`)
- **Formulario de entrada** - Consumo (kWh), período de tiempo, eficiencia del sistema
- **Período personalizado** - Opción para ingresar días específicos
- **Cálculos** - Consumo total, TWh, CO2 evitado, costo estimado
- **Gráfico comparativo** - Visualización de consumo vs. otras fuentes
- **Validación de datos** - Botón deshabilitado hasta completar campos obligatorios

## Paleta de Colores

```css
--primary: #3B3C36                    /* Gris oscuro principal */
--background-secondary: #2a2a24      /* Gris más oscuro (footer, tarjetas) */
--primary-light: #D99058             /* Naranja principal (títulos, botones) */
--primary-hover: #D99058             /* Naranja hover */
--light-orange: #ffa500              /* Naranja claro (texto, acentos) */
--text-primary: #F2EBE2              /* Texto claro principal */
```

## Funcionalidades JavaScript

### Carrusel (`carrousel.js`)
- Auto-slide cada 6 segundos
- Navegación con botones (prev/next)
- Navegación por teclado (Arrow Left/Right)
- Soporte táctil (swipe gestures)
- Indicadores visuales opcionales

### Toggle de Navegación (`script.js`)
- Menú desplegable en pantallas pequeñas (< 768px)
- IIFE para evitar contaminación del scope global
- Cierre automático al hacer clic fuera del menú
- Atributos ARIA para accesibilidad

### Dashboard (`dashboard.js`)
- Inicialización de gráficos con Chart.js
- Opciones responsivas por tamaño de pantalla
- Tooltips personalizados
- Debounce en evento resize para optimizar rendimiento

### Calculadora (`calculadora.js`)
- Validación de inputs en tiempo real
- Cálculos de consumo, CO2 y costos
- Gráfico comparativo dinámico
- Alertas SweetAlert2 para errores
- Inyección de CSS responsivo

## Optimizaciones Realizadas

✅ **Código limpio** - Eliminación de comentarios redundantes HTML/CSS/JS  
✅ **Responsivo** - Uso de clamp(), aspect-ratio y media queries  
✅ **Accesible** - Atributos ARIA, navegación por teclado, etiquetas semánticas  
✅ **Rendimiento** - IIFE, debounce, lazy loading de gráficos  
✅ **UX mejorada** - Overlays centrados, transiciones suaves, indicadores visuales  

## Navegación

- **Inicio** → `index.html` - Página principal
- **Dashboard** → `src/views/dashboard.html` - Gráficos y estadísticas
- **Calculadora** → `src/views/calculadora.html` - Herramienta de cálculos

