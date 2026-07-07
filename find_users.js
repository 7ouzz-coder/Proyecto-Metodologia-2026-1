import { AppDataSource, connectDB } from "./backend/src/config/configDB.js";
await connectDB();
const users = await AppDataSource.query('SELECT email, role FROM "users"');
console.log(users);
process.exit(0);
