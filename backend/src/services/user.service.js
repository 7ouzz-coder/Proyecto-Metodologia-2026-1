import { AppDataSource } from "../config/configDB.js";
import { User } from "../entities/user.entity.js";
import bcrypt from "bcrypt";

const userRepository = AppDataSource.getRepository(User);

export async function createUser(data) {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const newUser = userRepository.create({
    email: data.email,
    password: hashedPassword,
    role: data.role ?? "Alumno",
    rut: data.rut ?? null,
    phone: data.phone ?? null,
    campus: data.campus ?? null,
  });

  return await userRepository.save(newUser);
}

export async function findUserByEmail(email) {
  return await userRepository.findOneBy({ email });
}

export async function findUsers() {
  return await userRepository.find();
}

export async function deleteUser(userId) {
  const user = await userRepository.findOneBy({ id: userId });
  
  if (!user) {
    throw new Error("Usuario no encontrado");
  }
  
  const result = await userRepository.remove(user);
  return result;
}
