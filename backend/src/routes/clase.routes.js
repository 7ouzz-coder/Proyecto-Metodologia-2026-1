import { Router } from "express";
import { crearClaseController, obtenerClasesController } from "../controllers/clase.controller.js";

const router = Router();

router.post("/", crearClaseController);
router.post("/crear", crearClaseController);
router.get("/", obtenerClasesController);

export default router;
