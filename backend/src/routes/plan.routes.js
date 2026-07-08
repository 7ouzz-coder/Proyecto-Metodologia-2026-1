import { Router } from "express";
import * as planController from "../controllers/plan.controller.js";

const router = Router();

router.post("/", planController.crearPlan);
router.get("/", planController.obtenerPlanes);
router.put("/:id", planController.actualizarPlan);
router.delete("/:id", planController.eliminarPlan);
router.patch("/:id/estado", planController.cambiarEstadoPlan);

export default router;
