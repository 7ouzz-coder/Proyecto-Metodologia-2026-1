import { EntitySchema } from "typeorm";

export const ExamenPsicotecnico = new EntitySchema({
  name: "ExamenPsicotecnico",
  tableName: "examenes_psicotecnicos",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    nota: {
      type: "float",
      nullable: false,
    },
    estado: {
      type: "varchar",
      length: 50,
      nullable: false, // "Aprobado", "Reprobado", "Pendiente"
    },
    created_at: {
      type: "timestamp",
      createDate: true,
      default: () => "CURRENT_TIMESTAMP",
    },
  },
  relations: {
    alumno: {
      type: "many-to-one",
      target: "Alumno",
      inverseSide: "examenes",
      joinColumn: { name: "alumnoId" },
      onDelete: "CASCADE",
    },
  },
});
