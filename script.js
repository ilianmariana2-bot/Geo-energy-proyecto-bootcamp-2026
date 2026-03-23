// Toggle del nav: adjunta listeners SOLO en pantallas pequeñas
(function () {// IIFE para evitar contaminar el scope global
    const BP = 768; // breakpoint en px
    const toggle = document.getElementById('nav-toggle'); // Obtener el boton de toggle
    if (!toggle) return; // Si no existe, salir
    const nav = toggle.closest('nav');// Obtener el nav contenedor

    // accesibilidad básica
    toggle.setAttribute('role', 'button');// rol de botón
    if (!nav.id) nav.id = 'main-navigation';// asignar id si no tiene
    toggle.setAttribute('aria-controls', nav.id);// relacionar con el nav
    toggle.setAttribute('aria-expanded', 'false');// inicialmente cerrado

    let attached = false;// estado de listeners

    function openNav() {// abrir nav
        nav.classList.add('open');// añadir clase open
        toggle.setAttribute('aria-expanded', 'true');// actualizar aria
    }
    function closeNav() {// cerrar nav
        nav.classList.remove('open');// eliminar clase open
        toggle.setAttribute('aria-expanded', 'false');// actualizar aria
    }

    function onToggleClick(e) {// manejar click en toggle
        e.preventDefault();// prevenir acción por defecto
        const opened = nav.classList.toggle('open');// alternar clase open
        toggle.setAttribute('aria-expanded', String(opened));// actualizar aria
    }

    function onDocClick(ev) {// manejar click en documento
        if (!nav.classList.contains('open')) return;// si no está abierto, salir
        if (nav.contains(ev.target) || toggle.contains(ev.target)) return;// si el click es dentro del nav o toggle, salir
        closeNav();// cerrar nav
    }

    function attach() {// adjuntar listeners
        if (attached) return;// si ya están adjuntados, salir
        toggle.addEventListener('click', onToggleClick);// escuchar click en toggle
        document.addEventListener('click', onDocClick);// escuchar click en documento
        attached = true;// actualizar estado
    }

    function detach() {// quitar listeners
        if (!attached) return;// si no están adjuntados, salir
        toggle.removeEventListener('click', onToggleClick);// quitar listener de toggle
        document.removeEventListener('click', onDocClick);// quitar listener de documento
        attached = false;// actualizar estado
    }

    // Manejar resize: adjuntar en pantallas pequeñas, quitar en grandes
    function handleResize() {// manejar cambio de tamaño
        if (window.innerWidth <= BP) {// en pantallas pequeñas adjuntamos el toggle
            attach();// adjuntar listeners
        } else {
            // en pantallas grandes cerramos y desactivamos el toggle
            closeNav();// cerrar nav
            detach();// quitar listeners
        }
    }

    // Inicializar según tamaño actual
    handleResize();

    // Escuchar cambios de tamaño
    window.addEventListener('resize', handleResize);
})();

