import axios from './root.service.js';

// Obtener todas las evaluaciones
/*
export async function getEvaluacionesService() {
    try {
        const response = await axios.get('/evaluaciones');
        return response.data.data;
    } catch (error) {
        console.error('Error al obtener evaluaciones', error);
        return [];
    }
}
*/
export async function getEvaluacionesService() {
  try {
    const response = await  axios.get("/evaluaciones");
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
}

// Crear evaluación
export async function createEvaluacionService(evaluacionData) {
    try {
        const response = await axios.post('/evaluaciones/crear', evaluacionData);
        return Object.assign(response.data, { status: response.status });
    } catch (error) {
        throw error.response?.data || error;
    }
}

// Actualizar evaluación
export async function updateEvaluacionService(id_evaluacion, evaluacionData) {
    try {
        const response = await axios.patch(`/evaluaciones/${id_evaluacion}`, evaluacionData);
        return Object.assign(response.data, { status: response.status });
    } catch (error) {
        throw error.response?.data || error;
    }
}

// Eliminar evaluación
export async function deleteEvaluacionService(id_evaluacion) {
    try {
        const response = await axios.delete(`/evaluaciones/${id_evaluacion}`);
        return Object.assign(response.data, { status: response.status });
    } catch (error) {
        throw error.response?.data || error;
    }
}
