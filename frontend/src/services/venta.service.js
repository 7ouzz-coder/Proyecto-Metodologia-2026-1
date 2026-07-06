import axios from './root.service.js';

export async function registrarVentaService(ventaData) {
    try {
        const response = await axios.post('/preregistro', ventaData);
        return Object.assign(response.data, { status: response.status });
    } catch (error) {
        throw error.response?.data || error;
    }
}

export async function obtenerClasesUsuarioService(userId) {
    return { data: { clases_disponibles: 0 } };
}

export async function listarVentasUsuarioService(userId) {
    return { data: [] };
}

export async function aprobarVentaService(preregistroId) {
    try {
        const response = await axios.post(`/preregistro/${preregistroId}/aprobar`);
        return Object.assign(response.data, { status: response.status });
    } catch (error) {
        throw error.response?.data || error;
    }
}

export async function rechazarVentaService(preregistroId, motivo) {
    try {
        const response = await axios.post(`/preregistro/${preregistroId}/rechazar`, { motivo: motivo || "No cumple con los requisitos" });
        return Object.assign(response.data, { status: response.status });
    } catch (error) {
        throw error.response?.data || error;
    }
}

export async function obtenerHistorialVentasService() {
    try {
        const response = await axios.get(`/preregistro/historial`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}

export async function eliminarVentaService(preregistroId) {
    try {
        const response = await axios.post(`/preregistro/${preregistroId}/rechazar`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}

export async function listarVentasService() {
    try {
        const response = await axios.get(`/preregistro`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}
