import { Router } from "express";
import {
  programarExamenController,
  registrarResultadoController,
  obtenerExamenesController,
  obtenerExamenPorIdController,
  obtenerHistorialAlumnoController,
} from "../controllers/examen.controller.js";

const router = Router();

router.post("/", programarExamenController);

router.put("/:id/resultado", registrarResultadoController);

router.get("/", obtenerExamenesController);

router.get("/historial/:alumnoId", obtenerHistorialAlumnoController);

router.get("/:id", obtenerExamenPorIdController);

export default router;
