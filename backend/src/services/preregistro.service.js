import { AppDataSource } from "../config/configDB.js";
import { PreRegistro } from "../entities/preregistro.entity.js";
import { User } from "../entities/user.entity.js";
import bcrypt from "bcrypt";

export async function crearPreRegistro(data) {
  const repository = AppDataSource.getRepository(PreRegistro);
  const nuevoPreRegistro = repository.create({
    nombreCompleto: data.nombreCompleto,
    rut: data.rut,
    email: data.email,
    telefono: data.telefono,
    fechaNacimiento: data.fechaNacimiento,
    sede: data.sede,
    plan: data.plan,
    comprobantePagoUrl: data.comprobantePagoUrl,
    estado: "pendiente",
  });
  return await repository.save(nuevoPreRegistro);
}

export async function obtenerPreRegistrosPendientes() {
  const repository = AppDataSource.getRepository(PreRegistro);
  return await repository.find({ where: { estado: "pendiente" }, order: { created_at: "DESC" } });
}

export async function obtenerHistorialPreRegistros() {
  const repository = AppDataSource.getRepository(PreRegistro);
  return await repository.find({
    where: [
      { estado: "aceptado" },
      { estado: "rechazado" }
    ],
    order: { updated_at: "DESC" }
  });
}

export async function aprobarPreRegistro(id) {
  const preRegistroRepo = AppDataSource.getRepository(PreRegistro);
  const userRepo = AppDataSource.getRepository(User);

  const preRegistro = await preRegistroRepo.findOne({ where: { id } });
  if (!preRegistro) throw new Error("Solicitud no encontrada");
  if (preRegistro.estado !== "pendiente") throw new Error("La solicitud no está pendiente");

  preRegistro.estado = "aceptado";
  await preRegistroRepo.save(preRegistro);

  // Crear usuario Alumno
  const generatedPassword = await bcrypt.hash(preRegistro.rut, 10); // usar rut como pass inicial
  const email = preRegistro.email; // usamos el correo guardado del pre-registro

  const newUser = userRepo.create({
    email: email,
    password: generatedPassword,
    role: "Alumno",
    rut: preRegistro.rut,
    phone: preRegistro.telefono,
    campus: preRegistro.sede,
  });

  await userRepo.save(newUser);

  console.log(`[Email Mock] Hola ${preRegistro.nombreCompleto}, tu inscripción ha sido aceptada. Tus credenciales son - Email: ${email}, Clave: (tu rut)`);

  return { message: "Solicitud aprobada y usuario creado", user: newUser };
}

export async function rechazarPreRegistro(id, motivo) {
  const preRegistroRepo = AppDataSource.getRepository(PreRegistro);
  const preRegistro = await preRegistroRepo.findOne({ where: { id } });
  if (!preRegistro) throw new Error("Solicitud no encontrada");
  if (preRegistro.estado !== "pendiente") throw new Error("La solicitud no está pendiente");

  preRegistro.estado = "rechazado";
  preRegistro.motivoRechazo = motivo || "No cumple los requisitos";
  await preRegistroRepo.save(preRegistro);

  console.log(`[Email Mock] Enviando a ${preRegistro.email}: Hola ${preRegistro.nombreCompleto}, tu inscripción ha sido rechazada. Motivo: ${preRegistro.motivoRechazo}.`);

  return { message: "Solicitud rechazada" };
}
