import { Router } from "express";
import * as preRegistroController from "../controllers/preregistro.controller.js";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de multer
const uploadDir = path.join(__dirname, '../../public/uploads/comprobantes');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

const router = Router();

router.post("/", upload.single('comprobante'), preRegistroController.crearPreRegistro);
router.get("/", preRegistroController.obtenerPreRegistrosPendientes);
router.get("/historial", preRegistroController.obtenerHistorialPreRegistros);
router.post("/:id/aprobar", preRegistroController.aprobarPreRegistro);
router.post("/:id/rechazar", preRegistroController.rechazarPreRegistro);

export default router;
