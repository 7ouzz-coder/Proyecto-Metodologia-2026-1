import { AppDataSource } from "../config/configDB.js";
import { Alumno } from "../entities/alumno.entity.js";
import { TestTeorico } from "../entities/testTeorico.entity.js";
import { ExamenPsicotecnico } from "../entities/examenPsicotecnico.entity.js";

const alumnoRepository = AppDataSource.getRepository(Alumno);
const testRepository = AppDataSource.getRepository(TestTeorico);
const examenRepository = AppDataSource.getRepository(ExamenPsicotecnico);

export async function createAlumno(data) {
  if (!data.nombre || !data.email) {
    throw new Error("El nombre y email son requeridos");
  }

  const existingAlumno = await alumnoRepository.findOneBy({ email: data.email });
  if (existingAlumno) {
    throw new Error("El email ya está registrado para otro alumno");
  }

  const nuevoAlumno = alumnoRepository.create({
    nombre: data.nombre,
    email: data.email,
    estado: "Activo",
    certificadoHabilitado: false,
  });

  return await alumnoRepository.save(nuevoAlumno);
}

export async function getAllAlumnos() {
  const alumnos = await alumnoRepository.find({
    relations: ["tests", "examenes"],
  });

  // Calcular promedios y estados dinámicamente para cada alumno
  return alumnos.map((alumno) => {
    const totalTests = alumno.tests.reduce((sum, t) => sum + t.nota, 0);
    const promedioTests = alumno.tests.length > 0 ? totalTests / alumno.tests.length : 0;

    // Obtener el último examen psicotécnico registrado 
    const examenesOrdenados = [...alumno.examenes].sort((a, b) => b.id - a.id);
    const ultimoExamen = examenesOrdenados[0] || null;

    return {
      id: alumno.id,
      nombre: alumno.nombre,
      email: alumno.email,
      estado: alumno.estado,
      certificadoHabilitado: alumno.certificadoHabilitado,
      promedioTests: Math.round(promedioTests * 100) / 100, // Redondear a 2 decimales
      ultimoExamenPsicotecnico: ultimoExamen
        ? { nota: ultimoExamen.nota, estado: ultimoExamen.estado }
        : null,
      created_at: alumno.created_at,
    };
  });
}

export async function getAlumnoById(id) {
  const alumno = await alumnoRepository.findOne({
    where: { id: parseInt(id) },
    relations: ["tests", "examenes"],
  });

  if (!alumno) {
    throw new Error("Alumno no encontrado");
  }

  const totalTests = alumno.tests.reduce((sum, t) => sum + t.nota, 0);
  const promedioTests = alumno.tests.length > 0 ? totalTests / alumno.tests.length : 0;

  const examenesOrdenados = [...alumno.examenes].sort((a, b) => b.id - a.id);
  const ultimoExamen = examenesOrdenados[0] || null;

  return {
    ...alumno,
    promedioTests: Math.round(promedioTests * 100) / 100,
    ultimoExamenPsicotecnico: ultimoExamen,
  };
}

export async function addTestTeorico(alumnoId, nota) {
  const alumno = await alumnoRepository.findOneBy({ id: parseInt(alumnoId) });
  if (!alumno) {
    throw new Error("Alumno no encontrado");
  }

  const notaNum = parseFloat(nota);
  if (isNaN(notaNum) || notaNum < 0 || notaNum > 100) {
    throw new Error("La nota del test debe ser un número entre 0 y 100");
  }

  const nuevoTest = testRepository.create({
    nota: notaNum,
    alumno: alumno,
  });

  const testGuardado = await testRepository.save(nuevoTest);
  delete testGuardado.alumno; 
  return testGuardado;
}

export async function addExamenPsicotecnico(alumnoId, nota, estado) {
  const alumno = await alumnoRepository.findOneBy({ id: parseInt(alumnoId) });
  if (!alumno) {
    throw new Error("Alumno no encontrado");
  }

  const notaNum = parseFloat(nota);
  if (isNaN(notaNum) || notaNum < 0 || notaNum > 100) {
    throw new Error("La nota del examen debe ser un número entre 0 y 100");
  }

  const estadoValido = ["Aprobado", "Reprobado", "Pendiente"];
  if (!estado || !estadoValido.includes(estado)) {
    throw new Error("El estado del examen debe ser 'Aprobado', 'Reprobado' o 'Pendiente'");
  }

  const nuevoExamen = examenRepository.create({
    nota: notaNum,
    estado: estado,
    alumno: alumno,
  });

  const examenGuardado = await examenRepository.save(nuevoExamen);
  delete examenGuardado.alumno; 
  return examenGuardado;
}

export async function egresarAlumno(alumnoId) {
  const alumno = await alumnoRepository.findOne({
    where: { id: parseInt(alumnoId) },
    relations: ["tests", "examenes"],
  });

  if (!alumno) {
    throw new Error("Alumno no encontrado");
  }

  if (alumno.estado === "Egresado") {
    throw new Error("El alumno ya se encuentra Egresado");
  }

  // Validar promedio de tests teóricos >= 80%
  const totalTests = alumno.tests.reduce((sum, t) => sum + t.nota, 0);
  const promedioTests = alumno.tests.length > 0 ? totalTests / alumno.tests.length : 0;

  if (promedioTests < 80) {
    throw new Error(
      `Requisitos no cumplidos: El promedio de test teóricos (${promedioTests.toFixed(2)}%) es inferior al 80% requerido.`
    );
  }

  // Validar que el último examen psicotécnico sea "Aprobado"
  const examenesOrdenados = [...alumno.examenes].sort((a, b) => b.id - a.id);
  const ultimoExamen = examenesOrdenados[0] || null;

  if (!ultimoExamen || ultimoExamen.estado !== "Aprobado") {
    const estadoActual = ultimoExamen ? ultimoExamen.estado : "No realizado";
    throw new Error(
      `Requisitos no cumplidos: El examen psicotécnico se encuentra en estado '${estadoActual}', pero se requiere 'Aprobado'.`
    );
  }

  // Egresar alumno y habilitar descarga del certificado
  alumno.estado = "Egresado";
  alumno.certificadoHabilitado = true;

  const alumnoActualizado = await alumnoRepository.save(alumno);
  delete alumnoActualizado.tests;
  delete alumnoActualizado.examenes;
  return alumnoActualizado;
}

export async function generarCertificado(alumnoId) {
  const alumno = await alumnoRepository.findOne({
    where: { id: parseInt(alumnoId) },
    relations: ["tests", "examenes"],
  });

  if (!alumno) {
    throw new Error("Alumno no encontrado");
  }

  if (alumno.estado !== "Egresado" || !alumno.certificadoHabilitado) {
    throw new Error("El certificado no está disponible para descarga. El alumno debe estar egresado.");
  }

  const totalTests = alumno.tests.reduce((sum, t) => sum + t.nota, 0);
  const promedioTests = alumno.tests.length > 0 ? totalTests / alumno.tests.length : 0;

  const fechaEmision = new Date().toLocaleDateString("es-CL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  const certId = `METO-CERT-${alumno.id}-${Date.now().toString(36).toUpperCase()}`;

  const certText = `CERTIFICADO DE EGRESADO

Alumno: ${alumno.nombre}
Email: ${alumno.email}

Promedio test teórico: ${promedioTests.toFixed(2)}%
Examen psicotécnico: APROBADO

Fecha de emisión: ${fechaEmision}
Código de certificado: ${certId}
`;

  return {
    filename: `certificado_${alumno.nombre.replace(/\s+/g, "_").toLowerCase()}.txt`,
    content: certText,
    metadata: {
      alumno: alumno.nombre,
      email: alumno.email,
      promedio: promedioTests.toFixed(2),
      certificadoId: certId,
      fecha: fechaEmision,
    }
  };
}
