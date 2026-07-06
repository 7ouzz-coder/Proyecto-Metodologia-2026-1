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

async function iniciarVehiculos() {
  try {
    await crearVehiculoNulo();
  } catch (error) {
    console.error("Error al crear vehiculos:", error);
  }
}

export { iniciarUsuarios, iniciarVehiculos };