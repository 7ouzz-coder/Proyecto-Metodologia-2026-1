import { AppDataSource } from "../config/configDB.js";
import { ExamenPractico } from "../entities/examen.entity.js";
import { Clase } from "../entities/clase.entity.js";
import { User } from "../entities/user.entity.js";

// ─────────────────────────────────────────────────────────────
// CONSTANTES
// ─────────────────────────────────────────────────────────────

// Mínimo de clases prácticas completadas para rendir el examen (RF1)
const MIN_CLASES_PRACTICAS = 5;

// Tipos de vehículo válidos para el examen de licencia clase B
const TIPOS_VEHICULO = ["mecanico", "automatico"];

// Códigos de faltas válidos según ficha oficial de examen clase B
const FALTAS_LEVES = new Set([
  "L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8", "L9", "L10",
  "L11", "L12", "L13", "L14", "L15", "L16", "L17", "L18", "L19",
  "L21", "L22", "L23", "L24", "L25", "L26",
]);
const FALTAS_GRAVES = new Set([
  "G1", "G2", "G3", "G4", "G5", "G7", "G8", "G9", "G10",
  "G11", "G12", "G13", "G14", "G15", "G16", "G17", "G18", "G19", "G20", "G21",
]);
const FALTAS_REPROBATORIAS = new Set(["R1", "R2", "R3", "R4", "R5", "R6", "R7"]);

// ─────────────────────────────────────────────────────────────
// HELPERS INTERNOS
// ─────────────────────────────────────────────────────────────

/** Valida que las fechas sean correctas y coherentes */
function validarFechas(fechaHoraInicio, fechaHoraFin) {
  const inicio = new Date(fechaHoraInicio);
  const fin = new Date(fechaHoraFin);

  if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
    throw new Error("Formato de fecha inválido. Use ISO 8601 (ej: 2026-07-10T09:00:00).");
  }
  if (inicio >= fin) {
    throw new Error("La fecha/hora de inicio debe ser anterior a la de término.");
  }
  if (inicio < new Date()) {
    throw new Error("No se puede programar un examen en una fecha/hora pasada.");
  }
  return { inicio, fin };
}

/**
 * Verifica disponibilidad del vehículo en el horario indicado.
 * Revisa tanto la tabla de clases (Ángel) como la de exámenes propios.
 *
 * INTEGRACIÓN GABRIEL (pendiente):
 * Cuando Gabriel cree la entidad Vehiculo, agregar aquí:
 *   const vehiculo = await vehiculoRepo.findOne({ where: { id: vehiculoId } });
 *   if (!vehiculo) throw new Error(`El vehículo "${vehiculoId}" no existe.`);
 *   if (vehiculo.estado === "En Mantenimiento")
 *     throw new Error(`El vehículo "${vehiculoId}" está en mantenimiento.`);
 */
async function verificarDisponibilidadVehiculo(vehiculoId, inicio, fin, examenRepo, claseRepo) {
  // Traslape con clases prácticas de Ángel
  const traslapeClase = await claseRepo
    .createQueryBuilder("clase")
    .where("clase.vehiculoId = :vehiculoId", { vehiculoId })
    .andWhere("LOWER(clase.tipo) = :tipo", { tipo: "práctica" })
    .andWhere("clase.fechaHoraInicio < :fin", { fin })
    .andWhere("clase.fechaHoraFin   > :inicio", { inicio })
    .getOne();

  if (traslapeClase) {
    throw new Error(
      `El vehículo "${vehiculoId}" ya está asignado a una clase práctica en ese horario ` +
      `(${traslapeClase.fechaHoraInicio.toLocaleString()} - ${traslapeClase.fechaHoraFin.toLocaleString()}).`
    );
  }

  // Traslape con otros exámenes prácticos ya registrados
  const traslapeExamen = await examenRepo
    .createQueryBuilder("examen")
    .where("examen.vehiculoId = :vehiculoId", { vehiculoId })
    .andWhere("examen.fechaHoraInicio < :fin", { fin })
    .andWhere("examen.fechaHoraFin   > :inicio", { inicio })
    .getOne();

  if (traslapeExamen) {
    throw new Error(
      `El vehículo "${vehiculoId}" ya está reservado para otro examen práctico en ese horario ` +
      `(${traslapeExamen.fechaHoraInicio.toLocaleString()} - ${traslapeExamen.fechaHoraFin.toLocaleString()}).`
    );
  }
}

/**
 * Procesa los códigos de faltas marcadas y devuelve los conteos por categoría.
 * Valida que cada código pertenezca a los definidos en la ficha oficial.
 * @returns {{ leves, graves, reprobatorias, codigosValidos }}
 */
function procesarCodigosFaltas(codigos) {
  if (!codigos || !Array.isArray(codigos) || codigos.length === 0) {
    return { leves: 0, graves: 0, reprobatorias: 0, codigosValidos: [] };
  }

  const codigosValidos = [];
  let leves = 0;
  let graves = 0;
  let reprobatorias = 0;

  for (const codigo of codigos) {
    const c = codigo.toUpperCase().trim();
    if (FALTAS_LEVES.has(c)) {
      leves++;
      codigosValidos.push(c);
    } else if (FALTAS_GRAVES.has(c)) {
      graves++;
      codigosValidos.push(c);
    } else if (FALTAS_REPROBATORIAS.has(c)) {
      reprobatorias++;
      codigosValidos.push(c);
    } else {
      throw new Error(
        `El código de falta "${c}" no es válido. Use los códigos oficiales de la ficha clase B ` +
        `(L1-L26, G1-G21, R1-R7).`
      );
    }
  }

  return { leves, graves, reprobatorias, codigosValidos };
}

// PROGRAMAR EXAMEN PRÁCTICO

/**
 * Programa un nuevo examen práctico de conducción.
 * Body esperado:
 *   alumnoId, instructorId, vehiculoId, fechaHoraInicio, fechaHoraFin
 *   tipoVehiculo? ("mecanico" | "automatico"), marcaModelo?, kilometrajeInicial?
 */
export async function programarExamenService(data) {
  const {
    alumnoId, instructorId, vehiculoId,
    fechaHoraInicio, fechaHoraFin,
    tipoVehiculo, marcaModelo, kilometrajeInicial,
  } = data;

  // Validación de campos obligatorios
  if (!alumnoId) throw new Error("El ID del alumno es obligatorio.");
  if (!instructorId) throw new Error("El ID del instructor evaluador es obligatorio.");
  if (!vehiculoId) throw new Error("El identificador del vehículo (patente) es obligatorio.");
  if (!fechaHoraInicio) throw new Error("La fecha y hora de inicio son obligatorias.");
  if (!fechaHoraFin) throw new Error("La fecha y hora de término son obligatorias.");

  // Validar tipo de vehículo si se envía
  if (tipoVehiculo && !TIPOS_VEHICULO.includes(tipoVehiculo.toLowerCase())) {
    throw new Error(`El tipo de vehículo debe ser "mecanico" o "automatico".`);
  }

  // Validar kilometraje inicial si se envía
  if (kilometrajeInicial !== undefined && kilometrajeInicial !== null) {
    if (isNaN(kilometrajeInicial) || parseInt(kilometrajeInicial) < 0) {
      throw new Error("El kilometraje inicial debe ser un número positivo.");
    }
  }

  const { inicio, fin } = validarFechas(fechaHoraInicio, fechaHoraFin);

  const userRepo = AppDataSource.getRepository(User);
  const claseRepo = AppDataSource.getRepository(Clase);
  const examenRepo = AppDataSource.getRepository(ExamenPractico);

  // Verificar que el alumno existe y tiene el rol correcto
  const alumno = await userRepo.findOne({ where: { id: parseInt(alumnoId) } });
  if (!alumno) throw new Error(`No existe un usuario con ID ${alumnoId}.`);
  const rolAlumno = (alumno.role || "").toLowerCase();
  if (!rolAlumno.includes("alumno") && !rolAlumno.includes("estudiante")) {
    throw new Error(`El usuario con ID ${alumnoId} no tiene rol de alumno (rol actual: "${alumno.role}").`);
  }

  // Verificar que el instructor existe y tiene el rol correcto
  const instructor = await userRepo.findOne({ where: { id: parseInt(instructorId) } });
  if (!instructor) throw new Error(`No existe un usuario con ID ${instructorId}.`);
  const rolInstructor = (instructor.role || "").toLowerCase();
  if (!rolInstructor.includes("docente") && !rolInstructor.includes("profesor")) {
    throw new Error(`El usuario con ID ${instructorId} no tiene rol de instructor (rol actual: "${instructor.role}").`);
  }

  // Verificar mínimo de clases prácticas completadas
  const clasesCompletadas = await claseRepo
    .createQueryBuilder("clase")
    .innerJoin("clase.alumnos", "alumno", "alumno.id = :alumnoId", { alumnoId: parseInt(alumnoId) })
    .where("LOWER(clase.tipo) = :tipo", { tipo: "práctica" })
    .andWhere("clase.fechaHoraFin <= NOW()")
    .getCount();

  if (clasesCompletadas < MIN_CLASES_PRACTICAS) {
    throw new Error(
      `El alumno no cumple el mínimo de clases prácticas requeridas para rendir el examen. ` +
      `Completadas: ${clasesCompletadas} de ${MIN_CLASES_PRACTICAS} requeridas.`
    );
  }

  // Verificar disponibilidad del vehículo
  await verificarDisponibilidadVehiculo(vehiculoId, inicio, fin, examenRepo, claseRepo);

  // Verificar que el alumno no tenga ya un examen pendiente
  const examenExistente = await examenRepo.findOne({
    where: { alumno: { id: parseInt(alumnoId) }, estado: "pendiente" },
    relations: ["alumno"],
  });
  if (examenExistente) {
    throw new Error(
      `El alumno ya tiene un examen práctico pendiente (ID: ${examenExistente.id}). ` +
      `Debe completarse antes de programar uno nuevo.`
    );
  }

  // Verificar que el instructor no tenga otro examen en ese mismo horario
  const traslapeInstructor = await examenRepo
    .createQueryBuilder("examen")
    .innerJoin("examen.instructor", "instructor")
    .where("instructor.id = :instructorId", { instructorId: parseInt(instructorId) })
    .andWhere("examen.fechaHoraInicio < :fin", { fin })
    .andWhere("examen.fechaHoraFin   > :inicio", { inicio })
    .getOne();

  if (traslapeInstructor) {
    throw new Error(
      `El instructor ya tiene asignado otro examen en ese horario ` +
      `(${traslapeInstructor.fechaHoraInicio.toLocaleString()} - ${traslapeInstructor.fechaHoraFin.toLocaleString()}).`
    );
  }

  // Crear y guardar el examen
  const nuevoExamen = examenRepo.create({
    vehiculoId,
    tipoVehiculo: tipoVehiculo?.toLowerCase() || null,
    marcaModelo: marcaModelo?.trim() || null,
    kilometrajeInicial: kilometrajeInicial ? parseInt(kilometrajeInicial) : null,
    fechaHoraInicio: inicio,
    fechaHoraFin: fin,
    estado: "pendiente",
    alumno,
    instructor,
  });

  const examenGuardado = await examenRepo.save(nuevoExamen);

  // Notificación automática (simulada)
  console.log(`
[NOTIFICACIÓN AUTOMÁTICA — EXAMEN PRÁCTICO AGENDADO]
  Examen ID:    ${examenGuardado.id}
  Postulante:   ${alumno.email} (ID: ${alumno.id})
  Instructor:   ${instructor.email} (ID: ${instructor.id})
  Vehículo:     ${vehiculoId}${marcaModelo ? ` — ${marcaModelo}` : ""}${tipoVehiculo ? ` (${tipoVehiculo})` : ""}
  Inicio:       ${inicio.toLocaleString()}
  Término:      ${fin.toLocaleString()}
  Km inicial:   ${kilometrajeInicial ?? "No registrado"}

  Notificación enviada al postulante y al instructor.
`);

  return examenGuardado;
}

// REGISTRAR RESULTADO DEL EXAMEN

/**
 * Registra el resultado de un examen práctico finalizado.
 * El instructor debe indicar el resultado y las faltas cometidas.
 * Si hay alguna falta reprobatoria (R), el sistema fuerza "reprobado".
 *
 * Body esperado:
 *   resultado ("aprobado" | "reprobado")
 *   observaciones?
 *   codigosFaltas?  Array de strings: ["L1","G2","R1",...]
 *   kilometrajeFinal?
 */
export async function registrarResultadoService(id, data) {
  const {
    resultado,
    observaciones,
    codigosFaltas,
    kilometrajeFinal,
  } = data;

  const RESULTADOS_VALIDOS = ["aprobado", "reprobado"];

  if (!resultado) {
    throw new Error("El campo 'resultado' es obligatorio.");
  }
  if (!RESULTADOS_VALIDOS.includes(resultado.toLowerCase())) {
    throw new Error(`El resultado debe ser "aprobado" o "reprobado". Valor recibido: "${resultado}".`);
  }

  // Validar y procesar códigos de faltas si se envían
  const { leves, graves, reprobatorias, codigosValidos } = procesarCodigosFaltas(codigosFaltas);

  const examenRepo = AppDataSource.getRepository(ExamenPractico);

  const examen = await examenRepo.findOne({
    where: { id: parseInt(id) },
    relations: ["alumno", "instructor"],
  });

  if (!examen) throw new Error(`No existe un examen práctico con ID ${id}.`);

  // No se puede modificar un examen ya calificado
  if (examen.estado !== "pendiente") {
    throw new Error(
      `El examen con ID ${id} ya fue calificado con resultado "${examen.estado}". No se puede modificar.`
    );
  }

  // Si hay faltas reprobatorias (R), el resultado es reprobado automáticamente
  // independientemente de lo que indique el instructor
  let resultadoFinal = resultado.toLowerCase();
  if (reprobatorias > 0) {
    resultadoFinal = "reprobado";
  }

  // Validar kilometraje final si se envía
  if (kilometrajeFinal !== undefined && kilometrajeFinal !== null) {
    if (isNaN(kilometrajeFinal) || parseInt(kilometrajeFinal) < 0) {
      throw new Error("El kilometraje final debe ser un número positivo.");
    }
    if (examen.kilometrajeInicial && parseInt(kilometrajeFinal) <= examen.kilometrajeInicial) {
      throw new Error(
        `El kilometraje final (${kilometrajeFinal} km) debe ser mayor al inicial (${examen.kilometrajeInicial} km).`
      );
    }
  }

  // RF2: Guardar resultado en historial académico
  examen.estado = resultadoFinal;
  examen.observaciones = observaciones?.trim() || null;
  examen.faltasLeves = leves;
  examen.faltasGraves = graves;
  examen.faltasReprobatorias = reprobatorias;
  examen.codigosFaltas = codigosValidos.length > 0 ? codigosValidos : null;
  examen.kilometrajeFinal = kilometrajeFinal ? parseInt(kilometrajeFinal) : null;

  const examenActualizado = await examenRepo.save(examen);

  const motivoReprobatorio = reprobatorias > 0 && resultado.toLowerCase() === "aprobado"
    ? `\n  ⚠️  Resultado cambiado a "reprobado" automáticamente por ${reprobatorias} falta(s) reprobatoria(s).`
    : "";

  console.log(`
[RESULTADO REGISTRADO — HISTORIAL ACADÉMICO]
  Examen ID:      ${examen.id}
  Postulante:     ${examen.alumno.email} (ID: ${examen.alumno.id})
  Instructor:     ${examen.instructor.email} (ID: ${examen.instructor.id})
  Resultado:      ${resultadoFinal.toUpperCase()}${motivoReprobatorio}
  Faltas L:       ${leves}  |  Faltas G: ${graves}  |  Faltas R: ${reprobatorias}
  Códigos:        ${codigosValidos.length > 0 ? codigosValidos.join(", ") : "Ninguno registrado"}
  Observaciones:  ${observaciones?.trim() || "Sin observaciones"}
  Km final:       ${kilometrajeFinal ?? "No registrado"}
`);

  return examenActualizado;
}

// CONSULTAS

// Lista todos los exámenes del sistema (para secretaría)
export async function obtenerExamenesService() {
  const examenRepo = AppDataSource.getRepository(ExamenPractico);
  return await examenRepo.find({
    relations: ["alumno", "instructor"],
    order: { fechaHoraInicio: "ASC" },
  });
}

// Historial académico de un alumno
export async function obtenerHistorialAlumnoService(alumnoId) {
  const examenRepo = AppDataSource.getRepository(ExamenPractico);

  const examenes = await examenRepo.find({
    where: { alumno: { id: parseInt(alumnoId) } },
    relations: ["alumno", "instructor"],
    order: { fechaHoraInicio: "ASC" },
  });

  if (examenes.length === 0) {
    throw new Error(`No se encontraron exámenes registrados para el alumno con ID ${alumnoId}.`);
  }

  return examenes;
}

// Obtiene un examen específico por su ID
export async function obtenerExamenPorIdService(id) {
  const examenRepo = AppDataSource.getRepository(ExamenPractico);

  const examen = await examenRepo.findOne({
    where: { id: parseInt(id) },
    relations: ["alumno", "instructor"],
  });

  if (!examen) throw new Error(`No existe un examen práctico con ID ${id}.`);

  return examen;
}
