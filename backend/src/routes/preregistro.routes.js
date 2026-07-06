import { Router } from "express";
import * as preRegistroController from "../controllers/preregistro.controller.js";

const router = Router();

router.post("/", preRegistroController.crearPreRegistro);
router.get("/", preRegistroController.obtenerPreRegistrosPendientes);
router.get("/historial", preRegistroController.obtenerHistorialPreRegistros);
router.post("/:id/aprobar", preRegistroController.aprobarPreRegistro);
router.post("/:id/rechazar", preRegistroController.rechazarPreRegistro);

export default router;
