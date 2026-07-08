import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import { AppDataSource, connectDB } from "./config/configDB.js";
import { routerApi } from "./routes/index.routes.js";
import { iniciarUsuarios, iniciarPlanes } from "./config/initialSetup.js";

const app = express();
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(morgan("dev"));

// Servir archivos estáticos
app.use(express.static("public"));

// Inicializa la conexión a la base de datos
connectDB()
  .then(async () => {
    // Carga usuarios iniciales
    await iniciarUsuarios();
    await iniciarPlanes();

    // Carga todas las rutas de la aplicación
    routerApi(app);

    // Levanta el servidor Express
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor iniciado en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error al conectar con la base de datos:", error);
    process.exit(1);
  });
