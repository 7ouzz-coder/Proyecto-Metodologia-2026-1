import { AppDataSource } from "../config/configDB.js";
import { Clase } from "../entities/clase.entity.js";
import { User } from "../entities/user.entity.js";
import { In } from "typeorm";

export async function crearClase(data) {
  const claseRepo = AppDataSource.getRepository(Clase);
  const userRepo = AppDataSource.getRepository(User);

  const { descripcion, tipo, fechaHoraInicio, fechaHoraFin, docenteId, alumnoIds, vehiculoId } = data;
  
  if (!descripcion) throw new Error("La descripción es obligatoria.");
  if (!tipo) throw new Error("El tipo de clase es obligatorio.");

  let finalDocenteId = docenteId;
  if (!finalDocenteId && data.email_profesor) {
    const docenteUser = await userRepo.findOne({ where: { email: data.email_profesor } });
    if (docenteUser) {
      finalDocenteId = docenteUser.id;
    }
  }

  if (!finalDocenteId) throw new Error("El docente es obligatorio.");

  let startStr = fechaHoraInicio;
  let endStr = fechaHoraFin;
  if (!startStr && data.fecha_clase && data.hora_inicio) {
    startStr = `${data.fecha_clase}T${data.hora_inicio}:00`;
  }
  if (!endStr && data.fecha_clase && data.hora_fin) {
    endStr = `${data.fecha_clase}T${data.hora_fin}:00`;
  }

  if (!startStr || !endStr) throw new Error("Los horarios de inicio y término son obligatorios.");

  const inicio = new Date(startStr);
  const fin = new Date(endStr);
  if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
    throw new Error("Formato de fecha inválido.");
  }
  if (inicio >= fin) {
    throw new Error("La fecha/hora de inicio debe ser anterior a la de término.");
  }

  const docente = await userRepo.findOne({ where: { id: parseInt(finalDocenteId) } });
  if (!docente) {
    throw new Error(`El docente con ID ${finalDocenteId} no está registrado en el sistema.`);
  }

  const alumnosIdsNumeros = (alumnoIds && Array.isArray(alumnoIds)) ? alumnoIds.map(id => parseInt(id)) : [];
  let alumnos = [];
  if (alumnosIdsNumeros.length > 0) {
    alumnos = await userRepo.find({
      where: { id: In(alumnosIdsNumeros) }
    });

    if (alumnos.length !== alumnosIdsNumeros.length) {
      const encontradosIds = alumnos.map(a => a.id);
      const faltantes = alumnosIdsNumeros.filter(id => !encontradosIds.includes(id));
      throw new Error(`Los siguientes alumnos no están registrados en el sistema: ${faltantes.join(", ")}`);
    }
  }

  const tipoClaseNormalizado = tipo.toLowerCase().trim();
  let finalVehiculoId = null;

  if (tipoClaseNormalizado === "práctica" || tipoClaseNormalizado === "practica") {
    if (!vehiculoId || vehiculoId.trim() === "") {
      throw new Error("Para clases de carácter práctico es obligatorio registrar el identificador del vehículo asignado.");
    }
    finalVehiculoId = vehiculoId.trim();
  } else if (tipoClaseNormalizado === "teórica" || tipoClaseNormalizado === "teorica") {
    finalVehiculoId = vehiculoId ? vehiculoId.trim() : null;
  } else {
    throw new Error(`El tipo de clase "${tipo}" no es válido. Debe ser "Práctica" o "Teórica".`);
  }

  const nuevaClase = claseRepo.create({
    descripcion,
    tipo: tipoClaseNormalizado === "práctica" || tipoClaseNormalizado === "practica" ? "Práctica" : "Teórica",
    fechaHoraInicio: inicio,
    fechaHoraFin: fin,
    vehiculoId: finalVehiculoId,
    docente,
    alumnos,
  });

  const claseGuardada = await claseRepo.save(nuevaClase);

  console.log(`[NOTIFICACIÓN AUTOMÁTICA]
Para: Docente ${docente.email} (ID: ${docente.id})
Asunto: Nueva clase agendada en tu calendario
Cuerpo del mensaje:
Hola ${docente.email}, se ha registrado una nueva clase con ID ${claseGuardada.id}.
Detalles:
- Descripción: ${descripcion}
- Tipo: ${nuevaClase.tipo}
- Horario: Desde ${inicio.toLocaleString()} hasta ${fin.toLocaleString()}
${finalVehiculoId ? `- Vehículo Asignado: ${finalVehiculoId}\n` : ""}
Por favor revise su agenda en caso de que sea necesario solicitar modificaciones.`);

  return claseGuardada;
}

export async function obtenerClases() {
  const claseRepo = AppDataSource.getRepository(Clase);
  return await claseRepo.find({
    relations: ["docente", "alumnos"],
    order: { fechaHoraInicio: "ASC" }
  });
}
