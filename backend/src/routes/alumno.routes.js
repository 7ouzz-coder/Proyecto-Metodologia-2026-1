import { Router } from "express";
import {
  registerAlumno,
  listAlumnos,
  findAlumno,
  registerTest,
  registerExamen,
  promoteToEgresado,
  downloadCertificate,
} from "../controllers/alumno.controller.js";

const router = Router();

router.post("/", registerAlumno);
router.get("/", listAlumnos);
router.get("/:id", findAlumno);
router.post("/:id/tests", registerTest);
router.post("/:id/examenes", registerExamen);
router.post("/:id/egresar", promoteToEgresado);

router.get("/:id/certificado/descargar", downloadCertificate);

export default router;
