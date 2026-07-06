import { EntitySchema } from "typeorm";

export const ExamenPractico = new EntitySchema({
  name: "ExamenPractico",
  tableName: "examenes_practicos",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: "increment",
    },

    // Datos del vehículo
    vehiculoId: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    tipoVehiculo: {
      type: "varchar",
      length: 20,
      nullable: true,
    },
    marcaModelo: {
      type: "varchar",
      length: 150,
      nullable: true,
    },
    kilometrajeInicial: {
      type: "int",
      nullable: true,
    },
    fechaHoraInicio: {
      type: "timestamp",
      nullable: false,
    },
    fechaHoraFin: {
      type: "timestamp",
      nullable: false,
    },
    estado: {
      type: "varchar",
      length: 20,
      default: "pendiente",
      nullable: false,
    },
    kilometrajeFinal: {
      type: "int",
      nullable: true,
    },
    // conteo de faltas
    faltasLeves: {
      type: "int",
      default: 0,
      nullable: false,
    },
    faltasGraves: {
      type: "int",
      default: 0,
      nullable: false,
    },
    faltasReprobatorias: {
      type: "int",
      default: 0,
      nullable: false,
    },
    codigosFaltas: {
      type: "simple-json",
      nullable: true,
    },
    // observaciones del instructor
    observaciones: {
      type: "text",
      nullable: true,
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
    alumno: {
      target: "User",
      type: "many-to-one",
      joinColumn: { name: "alumnoId" },
      nullable: false,
      onDelete: "CASCADE",
    },
    instructor: {
      target: "User",
      type: "many-to-one",
      joinColumn: { name: "instructorId" },
      nullable: false,
      onDelete: "CASCADE",
    },
  },
});
