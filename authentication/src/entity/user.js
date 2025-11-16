import { EntitySchema } from "typeorm";

export default new EntitySchema({
  name: "User", // internal entity name
  tableName: "users", // actual PostgreSQL table name
  columns: {
    id: {
      type: "integer",
      primary: true,
      generated: true, // auto-increment
    },
    email: {
      type: "text",
      unique: true, // must be unique
      nullable: false,
    },
    password_hash: {
      type: "text",
      nullable: false,
    },
  },
});
