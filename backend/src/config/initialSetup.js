"use strict";
import { User } from "../entities/user.entity.js";
import { AppDataSource } from "./configDB.js";
import bcrypt from "bcrypt";

const encryptPassword = async (password) => await bcrypt.hash(password, 10);
const crearVehiculoNulo = async () => { console.log(" => Vehículo nulo simulado"); };

async function iniciarUsuarios() {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const count = await userRepository.count();
    if (count > 0) return;

    const now = new Date();

    await Promise.all([
      userRepository.save(userRepository.create({
        email: "pedro@gmail.com",
        password: await encryptPassword("secre2026"),
        role: "secretario",
      })),
      userRepository.save(userRepository.create({
        email: "alvaro@gmail.com",
        password: await encryptPassword("profe2026"),
        role: "profesor",
      })),
      userRepository.save(userRepository.create({
        email: "martin@gmail.com",
        password: await encryptPassword("alum2026"),
        role: "estudiante",
      })),
    ]);

    console.log(" => Usuarios creados");
  } catch (error) {
    console.error("Error al crear usuarios:", error);
  }
}

import { Plan } from "../entities/plan.entity.js";

async function iniciarPlanes() {
  try {
    const planRepository = AppDataSource.getRepository(Plan);
    const count = await planRepository.count();
    if (count > 0) return;

    await Promise.all([
      planRepository.save(planRepository.create({
        nombre: "Básico",
        costo: 50000,
        duracion_semanas: 4,
        clases_totales: 8,
        tipo: "completo"
      })),
      planRepository.save(planRepository.create({
        nombre: "Intermedio",
        costo: 80000,
        duracion_semanas: 6,
        clases_totales: 15,
        tipo: "completo"
      })),
      planRepository.save(planRepository.create({
        nombre: "Avanzado",
        costo: 120000,
        duracion_semanas: 8,
        clases_totales: 25,
        tipo: "completo"
      }))
    ]);

    console.log(" => Planes creados");
  } catch (error) {
    console.error("Error al crear planes:", error);
  }
}

async function iniciarVehiculos() {
  try {
    await crearVehiculoNulo();
  } catch (error) {
    console.error("Error al crear vehiculos:", error);
  }
}

export { iniciarUsuarios, iniciarVehiculos, iniciarPlanes };