"use strict";
import { DataSource } from "typeorm";
import { DATABASE, DB_USERNAME, HOST, PASSWORD, DB_PORT } from "./configEnv.js";
import { User } from "../entities/user.entity.js";
import { Clase } from "../entities/clase.entity.js";
import { PreRegistro } from "../entities/preregistro.entity.js";
import { Vehiculo } from "../entities/vehiculo.entity.js";

import { User } from "../entities/user.entity.js";
import { Clase } from "../entities/clase.entity.js";
import { Vehiculo } from "../entities/vehiculo.entity.js";
import { Alumno } from "../entities/alumno.entity.js";
import { Examen } from "../entities/examen.entity.js";
import { ExamenPsicotecnico } from "../entities/examenPsicotecnico.entity.js";
import { PreRegistro } from "../entities/preregistro.entity.js";
import { TestTeorico } from "../entities/testTeorico.entity.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: `${HOST}`,
  port: DB_PORT,
  username: `${DB_USERNAME}`,
  password: `${PASSWORD}`,
  database: `${DATABASE}`,
  entities: [User, Clase, Vehiculo, Alumno, Examen, ExamenPsicotecnico, PreRegistro, TestTeorico],
  synchronize: true,
  logging: false,
});

export async function connectDB() {
  try {
    await AppDataSource.initialize();
    console.log("=> Conexión exitosa a la base de datos PostgreSQL!");
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
    process.exit(1);
  }
}
