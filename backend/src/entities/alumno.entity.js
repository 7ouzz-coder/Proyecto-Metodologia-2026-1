import { EntitySchema } from "typeorm";

export const Alumno = new EntitySchema({
  name: "Alumno",
  tableName: "alumnos",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    nombre: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    email: {
      type: "varchar",
      length: 255,
      unique: true,
      nullable: false,
    },
    estado: {
      type: "varchar",
      length: 50,
      default: "Activo", // "Activo", "Egresado"
    },
    certificadoHabilitado: {
      type: "boolean",
      default: false,
    },
    created_at: {
      type: "timestamp",
      createDate: true,
      default: () => "CURRENT_TIMESTAMP",
    },
    updated_at: {
      type: "timestamp",
      updateDate: true,
      default: () => "CURRENT_TIMESTAMP",
    },
  },
  relations: {
    tests: {
      type: "one-to-many",
      target: "TestTeorico",
      inverseSide: "alumno",
      cascade: true,
    },
    examenes: {
      type: "one-to-many",
      target: "ExamenPsicotecnico",
      inverseSide: "alumno",
      cascade: true,
    },
  },
});
