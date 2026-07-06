import axios from './root.service.js';

/**
 * Programa un nuevo examen práctico.
 * @param {Object} data  alumnoId, instructorId, vehiculoId, fechaHoraInicio, fechaHoraFin,
 *                       tipoVehiculo?, marcaModelo?, kilometrajeInicial?
 */
export const programarExamen = async (data) => {
    const response = await axios.post('/examenes/', data);
    return response.data;
};

/**
 * Registra el resultado de un examen práctico pendiente.
 * @param {number|string} id  ID del examen
 * @param {Object} data       resultado, observaciones?, codigosFaltas?, kilometrajeFinal?
 */
export const registrarResultado = async (id, data) => {
    const response = await axios.put(`/examenes/${id}/resultado`, data);
    return response.data;
};

/** Lista todos los exámenes del sistema (para secretaría/profesor). */
export const getExamenes = async () => {
    const response = await axios.get('/examenes/');
    return response.data;
};

/**
 * Obtiene un examen específico por ID.
 * @param {number|string} id
 */
export const getExamenById = async (id) => {
    const response = await axios.get(`/examenes/${id}`);
    return response.data;
};

/**
 * Historial académico de un alumno.
 * @param {number|string} alumnoId
 */
export const getHistorialAlumno = async (alumnoId) => {
    const response = await axios.get(`/examenes/historial/${alumnoId}`);
    return response.data;
};

/**
 * Lista de estudiantes — se obtiene desde /auth/users y se filtra en cliente.
 * Devuelve sólo los usuarios cuyo rol incluye "alumno" o "estudiante".
 */
export const getStudentList = async () => {
    const response = await axios.get('/auth/users');
    const users = response.data?.data || response.data || [];
    return users.filter((u) => {
        const rol = (u.rol || u.role || '').toLowerCase();
        return rol.includes('alumno') || rol.includes('estudiante');
    });
};
