let comparisonChart = null;// Variables globales

// Inyectar CSS responsivo para la tarjeta de comparación
function injectComparisonChartCSS() {// Evitar inyección múltiple
    if (document.querySelector('style[data-injected="comparison-chart"]')) {// Ya inyectado
        return;
    }
    
    const isMobile = window.innerWidth < 640;
    const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
    
    const css = `
    /* Contenedor para gráfico de comparación responsivo */
    .comparison-chart {/* Contenedor de gráfico de comparación */
        width: 100%;
        height: auto;
        position: relative;
        display: flex;
        flex-direction: column;
    }
    
    .comparison-chart canvas {
        width: 100% !important;
        display: block;
    }
    
    /* Tamaños responsivos */
    @media (max-width: 640px) {
        .comparison-chart {
            height: 280px;
        }
        .comparison-chart canvas {
            height: 280px !important;
        }
    }
    
    @media (min-width: 641px) and (max-width: 1024px) {
        .comparison-chart {
            height: 320px;
        }
        .comparison-chart canvas {
            height: 320px !important;
        }
    }
    
    @media (min-width: 1025px) {
        .comparison-chart {
            height: 350px;
        }
        .comparison-chart canvas {
            height: 350px !important;
        }
    }
    `;
    
    const style = document.createElement('style');
    style.setAttribute('data-injected', 'comparison-chart');//
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    injectComparisonChartCSS();
    initializeCalculator();
    // Start calculator in compact mode (no large empty spaces)
    const calcContainer = document.querySelector('.calculator-container');
    if (calcContainer) {
        calcContainer.classList.add('compact');
        calcContainer.classList.remove('expanded');
    }
});

// Inicializar calculadora
function initializeCalculator() {
    const calcularBtn = document.getElementById('calcular');
    const tiempoSelect = document.getElementById('tiempo');
    const customDaysDiv = document.getElementById('custom-days');
    const limpiarBtn = document.getElementById('limpiar');

    // Mostrar/ocultar días personalizados y manejar estado del botón calcular
    const consumoInput = document.getElementById('consumo');
    const factorInput = document.getElementById('factor');
    const diasInput = document.getElementById('dias-custom');

    function handleTiempoChange() {
        if (!tiempoSelect) return;
        if (tiempoSelect.value === 'custom') {
            if (customDaysDiv) customDaysDiv.style.display = 'block';
        } else {
            if (customDaysDiv) customDaysDiv.style.display = 'none';
        }
        updateCalculateButtonState();
    }

    if (tiempoSelect) tiempoSelect.addEventListener('change', handleTiempoChange);

    // Calcular consumo
    if (calcularBtn) calcularBtn.addEventListener('click', calcularConsumo);
    // Si el botón está en estado visual "disabled-state" y el usuario hace click,
    // mostrar la alerta y evitar que se ejecute el cálculo.
    if (calcularBtn) {
        calcularBtn.addEventListener('click', function (e) {
            if (calcularBtn.classList.contains('disabled-state')) {
                // prevenir ejecución de otros listeners
                e.stopImmediatePropagation();
                if (window.Swal) {
                    Swal.fire({
                        icon: "error",
                        title: "Error...",
                        text: "Ingresa la Información.",
                        footer: '<a href="../../index.html">Vuelve al Inicio</a>'
                    });
                } else {
                    alert('Por favor completa todos los campos antes de calcular.');
                }
            }
        });
    }
    // Limpiar cálculo
    if (limpiarBtn) limpiarBtn.addEventListener('click', limpiarCalculo);

    // Control de estado del botón "Calcular"
    if (consumoInput) consumoInput.addEventListener('input', updateCalculateButtonState);
    if (factorInput) factorInput.addEventListener('change', updateCalculateButtonState);
    if (diasInput) diasInput.addEventListener('input', updateCalculateButtonState);
    if (tiempoSelect) tiempoSelect.addEventListener('change', updateCalculateButtonState);

    // Inicializar estado del botón calcular
    updateCalculateButtonState();
}

// Habilita/deshabilita el botón "Calcular" según si los inputs están llenos
function updateCalculateButtonState() {
    const calcularBtn = document.getElementById('calcular');
    const consumoInput = document.getElementById('consumo');
    const tiempoSelect = document.getElementById('tiempo');
    const factorInput = document.getElementById('factor');
    const diasInput = document.getElementById('dias-custom');

    if (!calcularBtn) return;

    const consumoValid = consumoInput && consumoInput.value.trim() !== '' && parseFloat(consumoInput.value) > 0;
    const tiempoValid = tiempoSelect && tiempoSelect.value !== '' && tiempoSelect.value !== null;
    let diasValid = true;
    if (tiempoSelect && tiempoSelect.value === 'custom') {
        diasValid = diasInput && diasInput.value.trim() !== '' && parseFloat(diasInput.value) > 0;
    }
    const factorValid = factorInput && factorInput.value !== '';

    // Visual state: add a class when not ready, but keep button clickable so we can show Swal when user clicks without complete data
    calcularBtn.classList.toggle('disabled-state', !(consumoValid && tiempoValid && diasValid && factorValid));
}

function calcularConsumo() {
    const consumoInput = document.getElementById('consumo');
    const tiempoSelect = document.getElementById('tiempo');
    const factorInput = document.getElementById('factor');
    const diasInput = document.getElementById('dias-custom');
    
    if (!consumoInput || !tiempoSelect || !factorInput) {
        if (window.Swal) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
                footer: '<a href="#">Why do I have this issue?</a>'
            });
        } else {
            alert('Por favor completa todos los campos antes de calcular.');
        }
        return;
    }

    // Evitar calcular si campos obligatorios están vacíos
    if (consumoInput.value.trim() === '' || tiempoSelect.value === '' || factorInput.value === '') {
        if (window.Swal) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
                footer: '<a href="#">Why do I have this issue?</a>'
            });
        } else {
            alert('Por favor completa todos los campos antes de calcular.');
        }
        return;
    }

    const consumoBase = parseFloat(consumoInput.value);
    const tiempoValue = tiempoSelect.value;
    const factor = parseFloat(factorInput.value);

    if (isNaN(consumoBase) || consumoBase <= 0) return;
    if (isNaN(factor) || factor <= 0) return;
    
    let dias;
    if (tiempoValue === 'custom') {
        if (!diasInput || diasInput.value.trim() === '') {
            if (window.Swal) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                    footer: '<a href="#">Why do I have this issue?</a>'
                });
            } else {
                alert('Por favor ingresa el número de días.');
            }
            return;
        }
        dias = parseFloat(diasInput.value);
    } else {
        dias = parseFloat(tiempoValue);
    }

    if (isNaN(dias) || dias <= 0) return;
    
    // Cálculos específicos para geotérmica
    const consumoTotal = consumoBase * dias * factor; // kWh
    const consumoTWh = consumoTotal / 1000000000; // Convertir a TWh
    const co2Evitado = consumoTotal * 0.2; // kg CO2 evitado (geotérmica es muy limpia)
    const costoEstimado = consumoTotal * 0.08; // USD (geotérmica es más económica)
    
    // Mostrar resultados
    const resultadoKwh = document.getElementById('resultado-kwh');
    const resultadoTwh = document.getElementById('resultado-twh');
    const resultadoCo2 = document.getElementById('resultado-co2');
    const resultadoCosto = document.getElementById('resultado-costo');
    
    if (resultadoKwh) resultadoKwh.textContent = `${consumoTotal.toLocaleString()} kWh`;
    if (resultadoTwh) resultadoTwh.textContent = `${consumoTWh.toFixed(6)} TWh`;
    if (resultadoCo2) resultadoCo2.textContent = `${co2Evitado.toLocaleString()} kg CO2`;
    if (resultadoCosto) resultadoCosto.textContent = `$${costoEstimado.toFixed(2)} USD`;
    
        // Mostrar botón limpiar después de calcular
        const limpiarBtn = document.getElementById('limpiar');
        if (limpiarBtn) {
            limpiarBtn.style.display = 'flex';
            limpiarBtn.classList.remove('hide');
        }
    
    // Actualizar gráfico de comparación
    updateComparisonChart(consumoTotal);
    // Expand the calculator cards to reveal chart and layout details
    const calcContainer = document.querySelector('.calculator-container');
    if (calcContainer) {
        calcContainer.classList.remove('compact');
        calcContainer.classList.add('expanded');
    }
}

// Función para limpiar el cálculo
function limpiarCalculo() {
    // Limpiar inputs (dejarlos vacíos)
    const consumoInput = document.getElementById('consumo');
    const tiempoSelect = document.getElementById('tiempo');
    const factorInput = document.getElementById('factor');
    const diasInput = document.getElementById('dias-custom');
    
    if (consumoInput) consumoInput.value = '';
    if (tiempoSelect) tiempoSelect.value = '';
    if (factorInput) factorInput.value = '';
    if (diasInput) diasInput.value = '';
    
    // Limpiar resultados
    const resultadoKwh = document.getElementById('resultado-kwh');
    const resultadoTwh = document.getElementById('resultado-twh');
    const resultadoCo2 = document.getElementById('resultado-co2');
    const resultadoCosto = document.getElementById('resultado-costo');
    
    if (resultadoKwh) resultadoKwh.textContent = '0 kWh';
    if (resultadoTwh) resultadoTwh.textContent = '0 TWh';
    if (resultadoCo2) resultadoCo2.textContent = '0 kg CO2';
    if (resultadoCosto) resultadoCosto.textContent = '$0 USD';
    
    // Destruir gráfico anterior si existe
    if (comparisonChart) {
        comparisonChart.destroy();
        comparisonChart = null;
    }
    
    // Ocultar botón limpiar con animación
    const limpiarBtn = document.getElementById('limpiar');
    if (limpiarBtn) {
        limpiarBtn.classList.add('hide');
        setTimeout(() => {
            limpiarBtn.style.display = 'none';
        }, 300);
    }
    
    // Ocultar div de días personalizados si estaba visible
    const customDaysDiv = document.getElementById('custom-days');
    if (customDaysDiv) customDaysDiv.style.display = 'none';
    
    // Actualizar estado del botón calcular
    if (typeof updateCalculateButtonState === 'function') updateCalculateButtonState();

    // Volver a modo compacto: ocultar chart y evitar grandes espacios
    const calcContainer = document.querySelector('.calculator-container');
    if (calcContainer) {
        calcContainer.classList.add('compact');
        calcContainer.classList.remove('expanded');
    }
}

// Helper para obtener opciones responsivas del gráfico
function getResponsiveChartOptions() {
    const isMobile = window.innerWidth < 640;
    const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
    
    return {
        isMobile,
        isTablet,
        xTickFontSize: isMobile ? 10 : isTablet ? 11 : 12,
        yTickFontSize: isMobile ? 9 : isTablet ? 10 : 11,
        titleFontSize: isMobile ? 12 : isTablet ? 13 : 14,
        maxRotation: isMobile ? 45 : 30,
        labelPadding: isMobile ? 8 : 10
    };
}

function updateComparisonChart(consumoKWh) {
    const comparisonCanvas = document.getElementById('comparisonChart');
    if (!comparisonCanvas) return;
    
    // Destruir gráfico anterior si existe
    if (comparisonChart) {
        comparisonChart.destroy();
        comparisonChart = null;
    }
    
    // Factores de emisión CO2 (kg CO2 / kWh) para diferentes fuentes
    const emissionFactors = {
        geothermica: 0.02,      // kg CO2/kWh - muy limpia
        eolica: 0.015,          // kg CO2/kWh - muy limpia
        solar: 0.048,           // kg CO2/kWh - limpia
        gasNatural: 0.450,      // kg CO2/kWh - intermedia
        carbon: 0.820           // kg CO2/kWh - muy contaminante
    };
    
    // Calcular emisiones CO2 para cada fuente
    const emisiones = {
        geothermica: consumoKWh * emissionFactors.geothermica,
        eolica: consumoKWh * emissionFactors.eolica,
        solar: consumoKWh * emissionFactors.solar,
        gasNatural: consumoKWh * emissionFactors.gasNatural,
        carbon: consumoKWh * emissionFactors.carbon
    };
    
    // Calcular reducción de CO2 usando geotérmica vs otras fuentes
    const reduccionGasNatural = emisiones.gasNatural - emisiones.geothermica;
    const reduccionCarbon = emisiones.carbon - emisiones.geothermica;
    
    const options = getResponsiveChartOptions();
    
    const ctx = comparisonCanvas.getContext('2d');
    comparisonChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Geotérmica', 'Eólica', 'Solar', 'Gas Natural', 'Carbón'],
            datasets: [{
                label: 'Emisiones CO2 (kg)',
                data: [
                    emisiones.geothermica,
                    emisiones.eolica,
                    emisiones.solar,
                    emisiones.gasNatural,
                    emisiones.carbon
                ],
                backgroundColor: [
                    'rgba(34, 177, 76, 0.8)',      // Verde - Geotérmica
                    'rgba(52, 168, 224, 0.8)',     // Azul claro - Eólica
                    'rgba(255, 235, 59, 0.8)',     // Amarillo - Solar
                    'rgba(255, 152, 0, 0.8)',      // Naranja - Gas Natural
                    'rgba(244, 67, 54, 0.8)'       // Rojo - Carbón
                ],
                borderColor: [
                    'rgba(34, 177, 76, 1)',
                    'rgba(52, 168, 224, 1)',
                    'rgba(255, 235, 59, 1)',
                    'rgba(255, 152, 0, 1)',
                    'rgba(244, 67, 54, 1)'
                ],
                borderWidth: 2,
                borderRadius: 4,
                hoverBackgroundColor: [
                    'rgba(34, 177, 76, 1)',
                    'rgba(52, 168, 224, 1)',
                    'rgba(255, 235, 59, 1)',
                    'rgba(255, 152, 0, 1)',
                    'rgba(244, 67, 54, 1)'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            animation: {
                duration: 600,
                easing: 'easeInOutQuart'
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: options.titleFontSize,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: options.xTickFontSize
                    },
                    borderColor: '#FFF',
                    borderWidth: 2,
                    cornerRadius: 4,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed.x || 0;
                            return `${value.toFixed(2)} kg CO2`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    grid: {
                        display: true,
                        drawBorder: true,
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        font: {
                            size: options.xTickFontSize
                        },
                        callback: function(value) {
                            return value.toFixed(1);
                        }
                    },
                    title: {
                        display: true,
                        text: 'kg CO2',
                        font: {
                            size: options.titleFontSize,
                            weight: 'bold'
                        }
                    }
                },
                y: {
                    ticks: {
                        autoSkip: false,
                        maxRotation: options.maxRotation,
                        padding: options.labelPadding,
                        color: '#F2EBE2',
                        font: {
                            size: options.yTickFontSize,
                            weight: '600'
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

console.log('Calculadora de Energía Geotérmica cargada correctamente');