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
    // Tipo de transmisión: "mecanico" | "automatico"
    tipoVehiculo: {
      type: "varchar",
      length: 20,
      nullable: true,
    },
    // Marca y modelo del vehículo (ej: "Toyota Corolla")
    marcaModelo: {
      type: "varchar",
      length: 150,
      nullable: true,
    },
    // Kilometraje al inicio del examen
    kilometrajeInicial: {
      type: "int",
      nullable: true,
    },

    // Horario
    fechaHoraInicio: {
      type: "timestamp",
      nullable: false,
    },
    fechaHoraFin: {
      type: "timestamp",
      nullable: false,
    },

    // Estado del examen: "pendiente" | "aprobado" | "reprobado"
    estado: {
      type: "varchar",
      length: 20,
      default: "pendiente",
      nullable: false,
    },

    // Kilometraje al término del examen
    kilometrajeFinal: {
      type: "int",
      nullable: true,
    },
    // Conteo total de faltas leves (L)
    faltasLeves: {
      type: "int",
      default: 0,
      nullable: false,
    },
    // Conteo total de faltas graves (G)
    faltasGraves: {
      type: "int",
      default: 0,
      nullable: false,
    },
    // Conteo total de faltas reprobatorias (R)
    faltasReprobatorias: {
      type: "int",
      default: 0,
      nullable: false,
    },
    codigosFaltas: {
      type: "simple-json",
      nullable: true,
    },
    // Observaciones del instructor sobre el desempeño del postulante
    observaciones: {
      type: "text",
      nullable: true,
    },

    // Auditoría
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
    // Alumno/postulante que rinde el examen
    alumno: {
      target: "User",
      type: "many-to-one",
      joinColumn: { name: "alumnoId" },
      nullable: false,
      onDelete: "CASCADE",
    },
    // Instructor evaluador asignado por la secretaría
    instructor: {
      target: "User",
      type: "many-to-one",
      joinColumn: { name: "instructorId" },
      nullable: false,
      onDelete: "CASCADE",
    },
  },
});
