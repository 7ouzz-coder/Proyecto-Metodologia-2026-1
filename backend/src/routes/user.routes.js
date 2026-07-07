import { Router } from "express";
import { findUsers } from "../services/user.service.js";
import { AppDataSource } from "../config/configDB.js";
import { Alumno } from "../entities/alumno.entity.js";
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

// RF1/RF2: Obtener lista de alumnos activos para asignación a clases
router.get("/frontend/getStudentList", async (req, res) => {
  try {
    const alumnoRepository = AppDataSource.getRepository(Alumno);
    const alumnos = await alumnoRepository.find();

    // Filtrar solo los alumnos con estado "Activo" (RF1: validar estado activo)
    const alumnosActivos = alumnos
      .filter(a => (a.estado || "").toLowerCase() === "activo")
      .map(a => ({
        id: a.id,
        nombre: a.nombre,
        email: a.email,
        estado: a.estado,
      }));

    handleSuccess(res, 200, "Lista de alumnos activos obtenida", alumnosActivos);
  } catch (error) {
    handleErrorServer(res, 500, "Error al obtener lista de alumnos", error.message);
  }
});

export default router;
