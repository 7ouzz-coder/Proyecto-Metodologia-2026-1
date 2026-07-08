import axios from './root.service.js';

export const programarExamen = async (data) => {
    const response = await axios.post('/examenes/', data);
    return response.data;
};

export const registrarResultado = async (id, data) => {
    const response = await axios.put(`/examenes/${id}/resultado`, data);
    return response.data;
};

export const getExamenes = async () => {
    const response = await axios.get('/examenes/');
    return response.data;
};

export const getExamenById = async (id) => {
    const response = await axios.get(`/examenes/${id}`);
    return response.data;
};

export const getHistorialAlumno = async (alumnoId) => {
    const response = await axios.get(`/examenes/historial/${alumnoId}`);
    return response.data;
};

export const getStudentList = async () => {
    const response = await axios.get('/auth/users');
    const users = response.data?.data || response.data || [];
    return users.filter((u) => {
        const rol = (u.rol || u.role || '').toLowerCase();
        return rol.includes('alumno') || rol.includes('estudiante');
    });
};