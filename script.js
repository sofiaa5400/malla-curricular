// --- script.js ---

document.addEventListener('DOMContentLoaded', () => {
    // Definición de los requisitos de los ramos
    // La clave es el ID del ramo, y el valor es un array con los IDs de los ramos que son sus requisitos.
    const requisitosDeRamos = {
        'taller-realidad-2': ['taller-realidad-1'],
        'trabajo-social-2': ['trabajo-social-1'],
        
        'intervencion-familias-2': ['intervencion-familias-1'],
        'investigacion-social-1': ['paradigmas'], // Ejemplo de requisito cruzado
        'practica-integrada-1': [
            'filosofia', 'modernidad', 'paradigmas', 'taller-realidad-1', 'trabajo-social-1', 'habilidades-logicas',
            'habilidades-personales', 'trabajo-social-psicologia', 'procesos-intervencion', 'taller-realidad-2', 'trabajo-social-2',
            'proyectos-sociales', 'politicas-sociales', 'intervencion-familias-1', 'territorio-sustentabilidad', 'trabajo-social-salud-mental'
        ],
        
        'investigacion-social-2': ['investigacion-social-1'],
        'intervencion-comunidades': ['actores-sociales'],
        'practica-integrada-2': ['practica-integrada-1'],

        'sistematizacion': ['investigacion-social-2'],
        'taller-grado': ['investigacion-social-2'],

        'trabajo-grado': ['taller-grado'],
        'evaluacion-proyectos': ['proyectos-sociales'],
        'tics-ia': ['investigacion-social-2'],

        'practica-profesional-1': ['practica-integrada-2', 'taller-grado'],
        'electivo-1': ['sistemas-proteccion'],
        'electivo-2': ['sistemas-proteccion'],
        
        'practica-profesional-2': ['practica-profesional-1'],
        'integracion-titulacion': ['practica-profesional-2', 'trabajo-grado'],
        'electivo-3': ['electivo-1', 'electivo-2'],
        
        // No hay requisitos para los electivos de la lista de abajo
    };

    const materias = document.querySelectorAll('.materia');
    const errorMessage = document.getElementById('error-message');

    // Función para guardar el estado de los ramos en localStorage
    function guardarEstadoRamos() {
        const estadoRamos = {};
        materias.forEach(materia => {
            estadoRamos[materia.id] = materia.classList.contains('aprobada');
        });
        localStorage.setItem('estadoRamos', JSON.stringify(estadoRamos));
    }

    // Función para cargar el estado de los ramos desde localStorage
    function cargarEstadoRamos() {
        const estadoRamos = JSON.parse(localStorage.getItem('estadoRamos'));
        if (estadoRamos) {
            materias.forEach(materia => {
                if (estadoRamos[materia.id]) {
                    materia.classList.add('aprobada');
                }
            });
        }
        // Después de cargar el estado, actualizamos los estados bloqueados
        actualizarEstadoRamos();
    }

    // Función para verificar si un ramo tiene sus requisitos aprobados
    function verificarRequisitos(idRamo) {
        if (!requisitosDeRamos[idRamo]) {
            return {
                bloqueado: false,
                faltantes: []
            };
        }

        const requisitos = requisitosDeRamos[idRamo];
        const ramosFaltantes = requisitos.filter(reqId => {
            const reqMateria = document.getElementById(reqId);
            return reqMateria && !reqMateria.classList.contains('aprobada');
        });

        return {
            bloqueado: ramosFaltantes.length > 0,
            faltantes: ramosFaltantes
        };
    }

    // Función para actualizar el estado visual de todos los ramos
    function actualizarEstadoRamos() {
        materias.forEach(materia => {
            const {
                bloqueado
            } = verificarRequisitos(materia.id);
            if (!materia.classList.contains('aprobada')) {
                if (bloqueado) {
                    materia.classList.add('bloqueada');
                } else {
                    materia.classList.remove('bloqueada');
                }
            }
        });
    }

    // Función para mostrar el pop-up de error
    function mostrarError(mensaje) {
        errorMessage.textContent = mensaje;
        errorMessage.classList.add('visible');
        setTimeout(() => {
            errorMessage.classList.remove('visible');
        }, 3000); // El mensaje desaparece después de 3 segundos
    }

    // Event listener para el clic en los ramos
    materias.forEach(materia => {
        materia.addEventListener('click', () => {
            // No hacemos nada si el ramo ya está aprobado
            if (materia.classList.contains('aprobada')) {
                return;
            }

            const {
                bloqueado,
                faltantes
            } = verificarRequisitos(materia.id);

            if (bloqueado) {
                const nombresFaltantes = faltantes.map(id => document.getElementById(id).textContent);
                mostrarError(`Debes aprobar los siguientes ramos antes: ${nombresFaltantes.join(', ')}`);
            } else {
                // Si no está bloqueado, lo marcamos como aprobado
                materia.classList.toggle('aprobada');
                guardarEstadoRamos();
                actualizarEstadoRamos(); // Volvemos a actualizar por si se desbloqueó otro ramo
            }
        });
    });

    // Inicializamos la aplicación
    cargarEstadoRamos();
});
