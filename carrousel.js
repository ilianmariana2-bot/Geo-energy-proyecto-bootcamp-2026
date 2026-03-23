// Variables globales del carrousel
let currentSlide = 0; // Índice del slide actual
const slides = document.querySelectorAll('.carousel-slide'); // Todos los slides
const totalSlides = slides.length; // Total de slides

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initializeCarousel(); // Inicializar carrusel
});

// Inicializar carrusel
function initializeCarousel() {
    const carousel = document.getElementById('carousel');
    const indicators = document.getElementById('indicators');

    if (!carousel) {
        console.error('Carrusel no encontrado');
        return;
    }

    // Si hay indicadores, configurarlos
    if (indicators && indicators.children.length === 0) {
        // Crear indicadores solo si el contenedor está vacío
        for (let i = 0; i < totalSlides; i++) {
            const indicator = document.createElement('div');
            indicator.classList.add('indicator');
            if (i === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => goToSlide(i));
            indicators.appendChild(indicator);
        }
    }

    // Adjuntar listeners a botones si existen
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Actualizar carrusel
    updateCarousel();
    
    // Auto-slide (opcional)
    startAutoSlide();

    // Soporte para touch gestures
    setupTouchSupport(carousel);

    // Soporte de teclado (flechas) para accesibilidad
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });
}

// Funciones del carrusel
function updateCarousel() {
    const carousel = document.getElementById('carousel');
    const indicators = document.querySelectorAll('.indicator');
    
    if (!carousel) return;
    
    carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Actualizar indicadores
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });

    // Actualizar slides activos
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
}

function goToSlide(slideIndex) {
    currentSlide = slideIndex;
    updateCarousel();
}

function startAutoSlide() {
    setInterval(() => {
        nextSlide();
    }, 6000); // Cambia cada 6 segundos
}

// Soporte para touch gestures en el carrusel
function setupTouchSupport(carousel) {
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    carousel.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleGesture();
    });

    function handleGesture() {
        if (touchEndX < touchStartX - 50) {
            nextSlide(); // Swipe left - siguiente slide
        }
        if (touchEndX > touchStartX + 50) {
            prevSlide(); // Swipe right - slide anterior
        }
    }
}