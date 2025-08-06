// -------------------- Malla de la carrera ---------------------
const malla = [
  {
    nombre: "I SEMESTRE",
    ramos: [
      "Filosofía y Epistemología",
      "Modernidad, Estado y Sociedad",
      "Paradigmas Sociales",
      "Taller de Acercamiento a la Realidad I",
      "Trabajo Social Contemporáneo y Complejidad I",
      "Habilidades para el Razonamiento Lógico"
    ]
  },
  {
    nombre: "II SEMESTRE",
    ramos: [
      "Habilidades Personales e Interpersonales",
      "Trabajo Social y Psicología",
      "Procesos de Intervención Social",
      "Taller de acercamiento a la Realidad II",
      "Trabajo Social Contemporáneo y Complejidad II"
    ],
    requisitos: {
      "Taller de acercamiento a la Realidad II": ["Taller de Acercamiento a la Realidad I"],
      "Trabajo Social Contemporáneo y Complejidad II": ["Trabajo Social Contemporáneo y Complejidad I"]
    }
  },
  {
    nombre: "III SEMESTRE",
    ramos: [
      "Proyectos sociales",
      "Políticas Sociales y Desarrollo",
      "Intervención con Familias I",
      "Intervención en el Territorio y Sustentabilidad",
      "Trabajo Social y Salud Mental"
    ]
  },
  {
    nombre: "IV SEMESTRE",
    ramos: [
      "Investigación Social I",
      "Legislación de Familia",
      "Intervención con Familias II",
      "Actores Sociales y Procesos Colectivos",
      "Práctica Integrada I"
    ],
    requisitos: {
      "Intervención con Familias II": ["Intervención con Familias I"]
    }
  },
  {
    nombre: "V SEMESTRE",
    ramos: [
      "Investigación Social II",
      "Legislación Laboral",
      "Sistema Político, Poder y Gestión Pública",
      "Intervención con Comunidades y Colectivos",
      "Práctica Integrada II A+S"
    ],
    requisitos: {
      "Investigación Social II": ["Investigación Social I"],
      "Práctica Integrada II A+S": ["Práctica Integrada I"]
    }
  },
  {
    nombre: "VI SEMESTRE",
    ramos: [
      "Sistematización",
      "Sistemas de Protección Social",
      "Política Pública, Participación y Liderazgo Estratégico",
      "Innovación Social",
      "Taller de Grado"
    ]
  },
  {
    nombre: "VII SEMESTRE",
    ramos: [
      "Trabajo de Grado",
      "Evaluación de Proyectos Sociales",
      "TIC e IA aplicadas al Trabajo Social"
    ]
  },
  {
    nombre: "VIII SEMESTRE",
    ramos: [
      "Actividad Integradora Certificación de Grado",
      "Ética Profesional",
      "Trabajo Social, Agencia y Complejidad"
    ]
  },
  {
    nombre: "IX SEMESTRE",
    ramos: [
      "Práctica Profesional I",
      "Electivo Profundización Profesional I",
      "Electivo Profundización Profesional II"
    ]
  },
  {
    nombre: "X SEMESTRE",
    ramos: [
      "Práctica Profesional II",
      "Actividad Integradora de Titulación",
      "Electivo Profundización Profesional III",
      "Taller de Empleabilidad"
    ]
  }
];

// Electivos especiales
const electivos = [
  "Formación Integral - Vida Saludable",
  "Globalización I",
  "Globalización II",
  "Equidad de Género",
  "Ciudadanía y DDHH Módulo 1",
  "Sello: Sustentabilidad y Tecnología Módulo 1",
  "Sello: Sustentabilidad y Tecnología Módulo 2",
  "Sello: Sustentabilidad y Tecnología Módulo 3",
  "Ciudadanía y DDHH Módulo 2",
  "Taller de Empleabilidad"
];

// Función para cargar desde localStorage
function getAprobados() {
  return JSON.parse(localStorage.getItem("aprobados")) || [];
}

function saveAprobado(nombre) {
  const aprobados = getAprobados();
  if (!aprobados.includes(nombre)) {
    aprobados.push(nombre);
    localStorage.setItem("aprobados", JSON.stringify(aprobados));
  }
}

function quitarAprobado(nombre) {
  let aprobados = getAprobados();
  aprobados = aprobados.filter(r => r !== nombre);
  localStorage.setItem("aprobados", JSON.stringify(aprobados));
}

// Función para verificar si un ramo tiene requisitos
function requisitosCumplidos(nombre, requisitos) {
  const aprobados = getAprobados();
  if (!requisitos || !requisitos[nombre]) return true;
  return requisitos[nombre].every(req => aprobados.includes(req));
}

// Generar la malla curricular
const mallaContainer = document.getElementById("malla");
const aprobados = getAprobados();

malla.forEach((semestre) => {
  const col = document.createElement("div");
  col.className = "semestre";
  col.innerHTML = `<h3>${semestre.nombre}</h3>`;

  semestre.ramos.forEach((ramo) => {
    const div = document.createElement("div");
    div.className = "ramo";
    div.textContent = ramo;

    const bloqueado = semestre.requisitos && semestre.requisitos[ramo] && !requisitosCumplidos(ramo, semestre.requisitos);
    if (aprobados.includes(ramo)) {
      div.classList.add("aprobado");
    } else if (bloqueado) {
      div.classList.add("bloqueado");
    }

    div.addEventListener("click", () => {
      if (div.classList.contains("bloqueado")) {
        alert(`No puedes aprobar este ramo aún. Requisitos pendientes:\n${semestre.requisitos[ramo].join(", ")}`);
        return;
      }

      div.classList.toggle("aprobado");
      const estaAprobado = div.classList.contains("aprobado");
      if (estaAprobado) {
        saveAprobado(ramo);
      } else {
        quitarAprobado(ramo);
      }

      location.reload(); // Recargar para habilitar/desbloquear ramos dependientes
    });

    col.appendChild(div);
  });

  mallaContainer.appendChild(col);
});

// Mostrar electivos
const electivosContainer = document.querySelector(".electivos-container");
electivos.forEach((electivo) => {
  const div = document.createElement("div");
  div.className = "electivo";
  div.textContent = electivo;

  if (aprobados.includes(electivo)) {
    div.classList.add("aprobado");
  }

  div.addEventListener("click", () => {
    div.classList.toggle("aprobado");
    const estaAprobado = div.classList.contains("aprobado");
    if (estaAprobado) {
      saveAprobado(electivo);
    } else {
      quitarAprobado(electivo);
    }
  });

  electivosContainer.appendChild(div);
});

