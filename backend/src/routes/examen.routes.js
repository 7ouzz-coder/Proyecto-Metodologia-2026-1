import { Router } from "express";
import {
  programarExamenController,
  registrarResultadoController,
  obtenerExamenesController,
  obtenerExamenPorIdController,
  obtenerHistorialAlumnoController,
} from "../controllers/examen.controller.js";

const router = Router();

// Programar examen práctico
// POST /api/examenes/
// Body: { alumnoId, instructorId, vehiculoId, fechaHoraInicio, fechaHoraFin }

router.post("/", programarExamenController);

// Registrar resultado del examen
// PUT /api/examenes/:id/resultado
// Body: { resultado: "aprobado"|"reprobado", observaciones? }

router.put("/:id/resultado", registrarResultadoController);

// GET /api/examenes/
router.get("/", obtenerExamenesController);

// GET /api/examenes/historial/:alumnoId
router.get("/historial/:alumnoId", obtenerHistorialAlumnoController);

// GET /api/examenes/:id
router.get("/:id", obtenerExamenPorIdController);

export default router;
