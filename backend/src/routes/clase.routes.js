import { Router } from "express";
import { crearClaseController, obtenerClasesController, updateClaseController, deleteClaseController } from "../controllers/clase.controller.js";

const router = Router();

router.post("/", crearClaseController);
router.post("/crear", crearClaseController);
router.get("/", obtenerClasesController);
router.patch("/:id", updateClaseController);
router.delete("/:id", deleteClaseController);

export default router;
