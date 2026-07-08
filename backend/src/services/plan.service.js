import { AppDataSource } from "../config/configDB.js";
import { Plan } from "../entities/plan.entity.js";

export async function crearPlan(data) {
  const repository = AppDataSource.getRepository(Plan);
  const nuevoPlan = repository.create(data);
  return await repository.save(nuevoPlan);
}

export async function obtenerPlanes() {
  const repository = AppDataSource.getRepository(Plan);
  return await repository.find({ order: { id_plan: "ASC" } });
}

export async function actualizarPlan(id, data) {
  const repository = AppDataSource.getRepository(Plan);
  const plan = await repository.findOne({ where: { id_plan: id } });
  if (!plan) throw new Error("Plan no encontrado");

  Object.assign(plan, data);
  return await repository.save(plan);
}

export async function eliminarPlan(id) {
  const repository = AppDataSource.getRepository(Plan);
  const plan = await repository.findOne({ where: { id_plan: id } });
  if (!plan) throw new Error("Plan no encontrado");

  await repository.remove(plan);
  return { message: "Plan eliminado exitosamente" };
}

export async function cambiarEstadoPlan(id, estado) {
  const repository = AppDataSource.getRepository(Plan);
  const plan = await repository.findOne({ where: { id_plan: id } });
  if (!plan) throw new Error("Plan no encontrado");

  plan.estado = estado;
  return await repository.save(plan);
}
