import { EntitySchema } from "typeorm";

export const TestTeorico = new EntitySchema({
  name: "TestTeorico",
  tableName: "tests_teoricos",
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
      inverseSide: "tests",
      joinColumn: { name: "alumnoId" },
      onDelete: "CASCADE",
    },
  },
});
