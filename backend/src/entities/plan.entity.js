import { EntitySchema } from "typeorm";

export const Plan = new EntitySchema({
  name: "Plan",
  tableName: "planes",
  columns: {
    id_plan: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    nombre: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    costo: {
      type: "int",
      nullable: false,
      default: 0,
    },
    duracion_semanas: {
      type: "int",
      nullable: false,
      default: 4,
    },
    clases_totales: {
      type: "int",
      nullable: false,
      default: 0,
    },
    tipo: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
    estado: {
      type: "varchar",
      length: 20,
      default: "activo", // activo, inactivo
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
});
