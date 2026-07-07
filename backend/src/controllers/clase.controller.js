import { crearClase, obtenerClases, updateClase, deleteClase } from "../services/clase.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";

export async function crearClaseController(req, res) {
  try {
    const data = req.body;
    const claseCreada = await crearClase(data);
    handleSuccess(res, 201, "Clase agendada y guardada de forma segura", claseCreada);
  } catch (error) {
    const clientErrors = [
      "descripción",
      "tipo",
      "horario",
      "docente",
      "alumno",
      "vehículo",
      "formato de fecha",
      "fecha/hora"
    ];
    const isClientError = clientErrors.some(msg => error.message.toLowerCase().includes(msg));
    
    if (isClientError) {
      handleErrorClient(res, 400, error.message);
    } else {
      handleErrorServer(res, 500, "Error interno al programar la clase", error.message);
    }
  }
}

export async function obtenerClasesController(req, res) {
  try {
    const clases = await obtenerClases();
    handleSuccess(res, 200, "Clases obtenidas exitosamente", clases);
  } catch (error) {
    handleErrorServer(res, 500, "Error al obtener las clases", error.message);
  }
}

export async function updateClaseController(req, res) {
  try {
    const { id } = req.params;
    const data = req.body;
    const claseActualizada = await updateClase(id, data);
    handleSuccess(res, 200, "Clase actualizada exitosamente", claseActualizada);
  } catch (error) {
    if (error.message.includes("no existe") || error.message.includes("inválidos")) {
      handleErrorClient(res, 400, error.message);
    } else {
      handleErrorServer(res, 500, "Error al actualizar la clase", error.message);
    }
  }
}

export async function deleteClaseController(req, res) {
  try {
    const { id } = req.params;
    const result = await deleteClase(id);
    handleSuccess(res, 200, result.message, null);
  } catch (error) {
    if (error.message.includes("no existe")) {
      handleErrorClient(res, 404, error.message);
    } else {
      handleErrorServer(res, 500, "Error al eliminar la clase", error.message);
    }
  }
}
