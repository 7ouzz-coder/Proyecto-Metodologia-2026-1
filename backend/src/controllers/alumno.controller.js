import {
  createAlumno,
  getAllAlumnos,
  getAlumnoById,
  addTestTeorico,
  addExamenPsicotecnico,
  egresarAlumno,
  generarCertificado,
} from "../services/alumno.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";

export async function registerAlumno(req, res) {
  try {
    const data = req.body;
    if (!data || Object.keys(data).length === 0) {
      return handleErrorClient(res, 400, "Los datos del alumno son requeridos");
    }

    const nuevoAlumno = await createAlumno(data);
    handleSuccess(res, 201, "Alumno registrado exitosamente", nuevoAlumno);
  } catch (error) {
    if (error.message.includes("ya está registrado")) {
      handleErrorClient(res, 409, error.message);
    } else {
      handleErrorClient(res, 400, error.message);
    }
  }
}

export async function listAlumnos(req, res) {
  try {
    const alumnos = await getAllAlumnos();
    handleSuccess(res, 200, "Alumnos obtenidos exitosamente", alumnos);
  } catch (error) {
    handleErrorServer(res, 500, "Error al obtener la lista de alumnos", error.message);
  }
}

export async function findAlumno(req, res) {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return handleErrorClient(res, 400, "El ID del alumno es inválido");
    }

    const alumno = await getAlumnoById(id);
    handleSuccess(res, 200, "Detalles del alumno obtenidos exitosamente", alumno);
  } catch (error) {
    handleErrorClient(res, 404, error.message);
  }
}

export async function registerTest(req, res) {
  try {
    const { id } = req.params;
    const { nota } = req.body;

    if (!id || isNaN(id)) {
      return handleErrorClient(res, 400, "El ID del alumno es inválido");
    }

    if (nota === undefined) {
      return handleErrorClient(res, 400, "La nota del test teórico es requerida");
    }

    const nuevoTest = await addTestTeorico(id, nota);
    handleSuccess(res, 201, "Test teórico de simulación registrado con éxito", nuevoTest);
  } catch (error) {
    handleErrorClient(res, 400, error.message);
  }
}

export async function registerExamen(req, res) {
  try {
    const { id } = req.params;
    const { nota, estado } = req.body;

    if (!id || isNaN(id)) {
      return handleErrorClient(res, 400, "El ID del alumno es inválido");
    }

    if (nota === undefined || !estado) {
      return handleErrorClient(res, 400, "La nota y el estado del examen psicotécnico son requeridos");
    }

    const nuevoExamen = await addExamenPsicotecnico(id, nota, estado);
    handleSuccess(res, 201, "Examen psicotécnico registrado con éxito", nuevoExamen);
  } catch (error) {
    handleErrorClient(res, 400, error.message);
  }
}

export async function promoteToEgresado(req, res) {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return handleErrorClient(res, 400, "El ID del alumno es inválido");
    }

    const alumnoEgresado = await egresarAlumno(id);
    handleSuccess(
      res,
      200,
      "Validaciones de egreso exitosas. El estado del alumno ha cambiado a 'Egresado' y se habilitó la descarga de su certificado.",
      alumnoEgresado
    );
  } catch (error) {
    handleErrorClient(res, 400, error.message);
  }
}

export async function downloadCertificate(req, res) {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return handleErrorClient(res, 400, "El ID del alumno es inválido");
    }

    const cert = await generarCertificado(id);

    // Configurar cabeceras de respuesta para forzar descarga del archivo de texto
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${cert.filename}"`);
    res.status(200).send(cert.content);
  } catch (error) {
    // Si no está egresado, retornamos 403 Forbidden
    handleErrorClient(res, 403, error.message);
  }
}
