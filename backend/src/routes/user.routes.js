import { Router } from "express";
import { findUsers } from "../services/user.service.js";
import { handleSuccess, handleErrorServer } from "../Handlers/responseHandlers.js";

const router = Router();

router.get("/frontend/getTeacherList", async (req, res) => {
  try {
    const allUsers = await findUsers();
    // Filter users whose role is Docente or Profesor
    const teachers = allUsers.filter(user => {
      const r = (user.role || "").toLowerCase();
      return r.includes("docente") || r.includes("profesor");
    });
    
    // Format to match what frontend expects: [{ id, nombre, email }]
    const formattedTeachers = teachers.map(t => ({
      id: t.id,
      nombre: t.email.split("@")[0], // User entity has no nombre, extract from email
      email: t.email
    }));

    handleSuccess(res, 200, "Lista de profesores obtenida", formattedTeachers);
  } catch (error) {
    handleErrorServer(res, 500, "Error al obtener lista de profesores", error.message);
  }
});

export default router;
