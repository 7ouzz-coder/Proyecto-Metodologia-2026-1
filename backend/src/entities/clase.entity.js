import { EntitySchema } from "typeorm";

export const Clase = new EntitySchema({
  name: "Clase",
  tableName: "clases",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    descripcion: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    tipo: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
    fechaHoraInicio: {
      type: "timestamp",
      nullable: false,
    },
    fechaHoraFin: {
      type: "timestamp",
      nullable: false,
    },
    vehiculoId: {
      type: "varchar",
      length: 100,
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
    docente: {
      target: "User",
      type: "many-to-one",
      joinColumn: {
        name: "docenteId",
      },
      nullable: false,
      onDelete: "CASCADE",
    },
    alumnos: {
      target: "User",
      type: "many-to-many",
      joinTable: {
        name: "clase_alumnos",
        joinColumn: {
          name: "claseId",
          referencedColumnName: "id",
        },
        inverseJoinColumn: {
          name: "alumnoId",
          referencedColumnName: "id",
        },
      },
      cascade: true,
      onDelete: "CASCADE",
    },
  },
});
