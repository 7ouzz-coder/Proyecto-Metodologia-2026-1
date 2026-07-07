import { EntitySchema } from "typeorm";

export const Vehiculo = new EntitySchema({
  name: "Vehiculo",
  tableName: "vehiculos",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    patente: {
      type: "varchar",
      length: 20,
      unique: true,
      nullable: false,
    },
    modelo: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    kilometraje: {
      type: "int",
      nullable: false,
      default: 0,
    },
    estado: {
      type: "varchar",
      length: 50,
      nullable: false,
      default: "Activo",
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
