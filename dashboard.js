let charts = {};// Almacenar instancias de gráficos

// Función helper para obtener opciones de ejes responsivas
function getResponsiveAxisOptions() {// Función para opciones responsivas
    const screenWidth = window.innerWidth;// ancho de pantalla
    const isMobile = screenWidth < 640;// móvil
    const isTablet = screenWidth >= 640 && screenWidth < 1024;// tablet
    
    return {// opciones basadas en tamaño
        xTickFont: isMobile ? 9 : (isTablet ? 10 : 11),// tamaño fuente eje X
        yTickFont: isMobile ? 8 : (isTablet ? 9 : 10),// tamaño fuente eje Y
        titleFont: isMobile ? 9 : (isTablet ? 10 : 11),// tamaño fuente título
        maxRotation: isMobile ? 45 : (isTablet ? 30 : 0),// rotación máxima etiquetas
        labelPadding: isMobile ? 3 : (isTablet ? 5 : 8)// padding etiquetas
    };
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Agregar clase para habilitar JavaScript
    document.body.classList.add('js-enabled');// Indica que JS está activo
    
    // Inyectar CSS responsivo para gráficos
    (function(){// función autoejecutable
        const css = `
        /* Canvas debe ocupar todo su contenedor */
        .chart-container canvas {
            width: 100% !important;
            height: 100% !important;
            display: block !important;
        }
        `;// CSS a inyectar
        const style = document.createElement('style');// crear elemento style
        style.setAttribute('data-injected','responsive-charts');// atributo identificador
        style.appendChild(document.createTextNode(css));// agregar CSS
        document.head.appendChild(style);// inyectar en head
    })();
    
    initializeCharts();// Inicializar gráficos
    
    // Listener para redimensionamiento responsivo
    let resizeTimeout;// temporizador para debounce
    window.addEventListener('resize', function() {// manejar resize
        clearTimeout(resizeTimeout);// limpiar temporizador previo
        resizeTimeout = setTimeout(function() {// ejecutar tras retraso
            // Actualizar gráficos si es necesario
            Object.values(charts).forEach(chart => {// iterar sobre gráficos
                if (chart && chart.resize) {// si el gráfico existe y tiene método resize
                    chart.resize();// llamar a resize
                }
            });
        }, 250);// retraso de 250ms
    });
});

// Mostrar sección específica
function showSection(sectionId) {// Función para mostrar sección
    const sections = document.querySelectorAll('.section');// obtener todas las secciones
    sections.forEach(section => {// iterar sobre secciones
        section.classList.remove('active');// quitar clase active
    });
    
    const targetSection = document.getElementById(sectionId);// obtener sección objetivo
    if (targetSection) {// si la sección existe
        targetSection.classList.add('active');// agregar clase active
        window.scrollTo({// desplazar a la sección
            top: 0,// al inicio
            behavior: 'smooth'// desplazamiento suave
        });
    }
}

// Inicializar gráficos con datos geotérmicos
function initializeCharts() {// Función para inicializar gráficos
    const axisOpts = getResponsiveAxisOptions();// obtener opciones responsivas
    
    // Gráfico de barras - Producción por país
    const barCtx = document.getElementById('barChart');//
    if (barCtx && !charts.barChart) {// si el canvas existe y no hay gráfico creado
        charts.barChart = new Chart(barCtx, {// crear nuevo gráfico
            type: 'bar',// tipo de gráfico
            data: {// datos del gráfico
                labels: ['Indonesia', 'Filipinas', 'Estados Unidos', 'Turquía', 'Nueva Zelanda', 'México'],// etiquetas de países
                datasets: [{// conjunto de datos
                    label: 'Producción (TWh)',// etiqueta del conjunto
                    data: [39.5, 28.8, 24.3, 21.4, 16.8, 12.2],// datos de producción
                    backgroundColor: [// colores de barras
                        'rgba(210, 105, 30, 0.8)',
                        'rgba(255, 99, 71, 0.8)',
                        'rgba(255, 165, 0, 0.8)',
                        'rgba(255, 140, 0, 0.8)',
                        'rgba(139, 69, 19, 0.8)',
                        'rgba(205, 133, 63, 0.8)'
                    ],
                    borderColor: [// colores de borde
                        'rgba(210, 105, 30, 1)',
                        'rgba(255, 99, 71, 1)',
                        'rgba(255, 165, 0, 1)',
                        'rgba(255, 140, 0, 1)',
                        'rgba(139, 69, 19, 1)',
                        'rgba(205, 133, 63, 1)'
                    ],
                    borderWidth: 2,// ancho del borde
                    borderRadius: 4// redondeo de bordes
                }]
            },
            options: {// opciones del gráfico
                responsive: true,// gráfico responsivo
                maintainAspectRatio: false,// no mantener proporción
                animation: {// animación al cargar
                    duration: 750,// duración en ms
                    easing: 'easeInOutQuart'// tipo de easing
                },
                plugins: {// opciones de plugins
                    legend: {// leyenda
                        display: false// no mostrar leyenda
                    },
                    tooltip: {// tooltip personalizado
                        backgroundColor: 'rgba(0,0,0,0.9)',// fondo del tooltip
                        padding: 12,// padding interno
                        borderColor: 'rgba(210, 105, 30, 1)',// color del borde
                        borderWidth: 2,// ancho del borde
                        titleFont: {// fuente del título
                            size: axisOpts.titleFont + 2,// tamaño del título
                            weight: 'bold'// negrita
                        },
                        bodyFont: {// fuente del cuerpo
                            size: axisOpts.titleFont// tamaño del cuerpo
                        },
                        callbacks: {// callbacks para personalizar contenido
                            label: function(context) {// función para etiqueta
                                return 'Producción: ' + context.parsed.y.toFixed(1) + ' TWh';// formato de la etiqueta
                            }
                        }
                    }
                },
                scales: {// configuración de escalas
                    x: {// eje X
                        grid: {//
                            display: false// no mostrar líneas de cuadrícula
                        },
                        ticks: {// ticks del eje X
                            font: {// fuente de los ticks
                                size: axisOpts.xTickFont,// tamaño de fuente
                                weight: 'bold',// peso de fuente
                                family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"// familia de fuente
                            },
                            color: 'rgba(242, 235, 226, 1)',// color de los ticks
                            maxRotation: axisOpts.maxRotation,// rotación máxima
                            minRotation: 0,// rotación mínima
                            padding: axisOpts.labelPadding,// padding de las etiquetas
                            autoSkip: false,// no omitir etiquetas automáticamente
                            callback: function(value, index, values) {// función para formatear etiquetas
                                const labels = ['Indonesia', 'Filipinas', 'Estados Unidos', 'Turquía', 'Nueva Zelanda', 'México'];// etiquetas originales
                                const label = labels[index];// obtener etiqueta actual
                                if (window.innerWidth < 640 && label && label.length > 12) {// en móviles
                                    return label.substring(0, 9) + '...';// truncar etiqueta larga
                                } else if (window.innerWidth < 1024 && label && label.length > 14) {//
                                    return label.substring(0, 11) + '...';// truncar etiqueta larga
                                }
                                return label;// devolver etiqueta completa
                            }
                        }
                    },
                    y: {// eje Y
                        beginAtZero: true,// comenzar en cero
                        grid: {// configuración de la cuadrícula
                            color: 'rgba(255, 255, 255, 0.1)',// color de las líneas
                            drawBorder: false// no dibujar borde
                        },
                        ticks: {// ticks del eje Y
                            font: {// fuente de los ticks
                                size: axisOpts.yTickFont,// tamaño de fuente
                                weight: '500',// peso de fuente
                                family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"// familia de fuente
                            },
                            color: 'rgba(242, 235, 226, 1)',// color de los ticks
                            padding: 10// padding de las etiquetas
                        },
                        title: {// título del eje Y
                            display: true,// mostrar título
                            text: 'TWh',// texto del título
                            font: {// fuente del título
                                size: axisOpts.titleFont,// tamaño de fuente
                                weight: 'bold',// peso de fuente
                                family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"// familia de fuente
                            },
                            color: 'rgba(210, 105, 30, 1)',// color del título
                            padding: 10// padding del título
                        }
                    }
                }
            }
        });
    }

    // Gráfico de torta - Tipos de sistemas geotérmicos
    const pieCtx = document.getElementById('pieChart');// obtener canvas
    if (pieCtx && !charts.pieChart) {// si el canvas existe y no hay gráfico creado
        charts.pieChart = new Chart(pieCtx, {// crear nuevo gráfico
            type: 'pie',// tipo de gráfico
            data: {// datos del gráfico
                labels: ['Ciclo Binario', 'Vapor Flash', 'Vapor Seco', 'Sistemas Híbridos'],// etiquetas
                datasets: [{// conjunto de datos
                    data: [42, 32, 20, 6],// datos porcentuales
                    backgroundColor: [// colores de secciones
                        'rgba(255, 165, 0, 0.8)',
                        'rgba(255, 99, 71, 0.8)',
                        'rgba(210, 105, 30, 0.8)',
                        'rgba(255, 140, 0, 0.8)'
                    ],
                    borderColor: [// colores de bordes
                        'rgba(255, 165, 0, 1)',
                        'rgba(255, 99, 71, 1)',
                        'rgba(210, 105, 30, 1)',
                        'rgba(255, 140, 0, 1)'
                    ],
                    borderWidth: 2// ancho de bordes
                }]
            },
            options: {// opciones del gráfico
                responsive: true,// gráfico responsivo
                maintainAspectRatio: false,// no mantener proporción
                animation: {// animación al cargar
                    duration: 800,// duración en ms
                    easing: 'easeInOutQuart'// tipo de easing
                },
                plugins: {// opciones de plugins
                    legend: {// leyenda
                        display: true,// mostrar leyenda
                        position: window.innerWidth < 640 ? 'bottom' : 'right',// posición responsiva
                        labels: {// opciones de etiquetas
                            font: {// fuente de las etiquetas
                                size: axisOpts.xTickFont,// tamaño de fuente
                                weight: 'bold',// peso de fuente
                                family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"// familia de fuente
                            },
                            color: 'rgba(242, 235, 226, 1)',// color de las etiquetas
                            padding: window.innerWidth < 640 ? 8 : 15,// padding responsivo
                            usePointStyle: true,// usar estilo de punto
                            pointStyle: 'circle'// estilo de punto
                        }
                    },
                    tooltip: {// tooltip personalizado
                        backgroundColor: 'rgba(0,0,0,0.9)',// fondo del tooltip
                        padding: 12,// padding interno
                        borderColor: 'rgba(210, 105, 30, 1)',// color del borde
                        borderWidth: 2,// ancho del borde
                        titleFont: {// fuente del título
                            size: axisOpts.titleFont + 2,// tamaño del título
                            weight: 'bold'//negrita
                        },
                        bodyFont: {// fuente del cuerpo
                            size: axisOpts.titleFont// tamaño del cuerpo
                        },
                        callbacks: {// callbacks para personalizar contenido
                            label: function(context) {// función para etiqueta
                                return context.label + ': ' + context.parsed + '%';// formato de la etiqueta
                            }
                        }
                    }
                }
            }
        });
    }

    // Gráfico de líneas - Evolución de capacidad geotérmica
    const lineCtx = document.getElementById('lineChart');// obtener canvas
    if (lineCtx && !charts.lineChart) {// si el canvas existe y no hay gráfico creado
        charts.lineChart = new Chart(lineCtx, {// crear nuevo gráfico
            type: 'line',// tipo de gráfico
            data: {// datos del gráfico
                labels: ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],// etiquetas de años
                datasets: [{// conjunto de datos
                    label: 'Capacidad Instalada (GW)',// etiqueta del conjunto
                    data: [14.1, 14.3, 14.9, 15.4, 16.4, 17.9, 21.8],// datos de capacidad
                    borderColor: 'rgba(210, 105, 30, 1)',// color de la línea
                    backgroundColor: 'rgba(210, 105, 30, 0.1)',// color del área bajo la línea
                    borderWidth: 3,// ancho de la línea
                    fill: true,// llenar área bajo la línea
                    tension: 0.4,// curvatura de la línea
                    pointRadius: window.innerWidth < 640 ? 4 : 5,// tamaño de los puntos responsivo
                    pointBackgroundColor: 'rgba(210, 105, 30, 1)',// color de los puntos
                    pointBorderColor: 'rgba(255, 255, 255, 1)',// color del borde de los puntos
                    pointBorderWidth: 2,// ancho del borde de los puntos
                    pointHoverRadius: 7// tamaño del punto al pasar el cursor
                }]
            },
            options: {// opciones del gráfico
                responsive: true,// gráfico responsivo
                maintainAspectRatio: false,// no mantener proporción
                animation: {// animación al cargar
                    duration: 900,// duración en ms
                    easing: 'easeInOutQuart'// tipo de easing
                },
                interaction: {// interacción del cursor
                    intersect: false,// no requerir intersección
                    mode: 'index'// modo de interacción
                },
                plugins: {// opciones de plugins
                    legend: {// leyenda
                        display: false// no mostrar leyenda
                    },
                    tooltip: {// tooltip personalizado
                        backgroundColor: 'rgba(0,0,0,0.9)',// fondo del tooltip
                        padding: 12,// padding interno
                        borderColor: 'rgba(210, 105, 30, 1)',// color del borde
                        borderWidth: 2,// ancho del borde
                        titleFont: {// fuente del título
                            size: axisOpts.titleFont + 2,// tamaño del título
                            weight: 'bold'// negrita
                        },
                        bodyFont: {// fuente del cuerpo
                            size: axisOpts.titleFont// tamaño del cuerpo
                        },
                        callbacks: {// callbacks para personalizar contenido
                            label: function(context) {// función para etiqueta
                                return 'Capacidad: ' + context.parsed.y.toFixed(1) + ' GW';// formato de la etiqueta
                            }
                        }
                    }
                },
                scales: {// configuración de escalas
                    x: {// eje X
                        grid: {//grilla
                            display: false// no mostrar líneas de cuadrícula
                        },
                        ticks: {// ticks del eje X
                            font: {// fuente de los ticks
                                size: axisOpts.xTickFont,// tamaño de fuente
                                weight: 'bold',// peso de fuente
                                family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"// familia de fuente
                            },
                            color: 'rgba(242, 235, 226, 1)',// color de los ticks
                            padding: axisOpts.labelPadding// padding de las etiquetas
                        },
                        title: {// título del eje X
                            display: true,// mostrar título
                            text: 'Año',// texto del título
                            font: {// fuente del título
                                size: axisOpts.titleFont,// tamaño de fuente
                                weight: 'bold',// peso de fuente
                                family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"// familia de fuente
                            },
                            color: 'rgba(210, 105, 30, 1)',// color del título
                            padding: 10// padding del título
                        }
                    },
                    y: {// eje Y
                        beginAtZero: false,// no comenzar en cero
                        grid: {// configuración de la cuadrícula
                            color: 'rgba(255, 255, 255, 0.1)',// color de las líneas
                            drawBorder: false// no dibujar borde
                        },
                        ticks: {// ticks del eje Y
                            font: {// fuente de los ticks
                                size: axisOpts.yTickFont,// tamaño de fuente
                                weight: '500',// peso de fuente
                                family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"// familia de fuente
                            },
                            color: 'rgba(242, 235, 226, 1)',// color de los ticks
                            padding: 10// padding de las etiquetas
                        },
                        title: {// título del eje Y
                            display: true,// mostrar título
                            text: 'GW',// texto del título
                            font: {// fuente del título
                                size: axisOpts.titleFont,// tamaño de fuente
                                weight: 'bold',// peso de fuente
                                family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"// familia de fuente
                            },
                            color: 'rgba(210, 105, 30, 1)',// color del título
                            padding: 10// padding del título
                        }
                    }
                }
            }
        });
    }
}