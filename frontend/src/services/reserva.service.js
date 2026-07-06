import axios from './root.service.js';

export async function getReservasUsuario(userId) {
    try {
        const response = await axios.get(`/reservas/user/${userId}`);
        return response.data;
    } catch (error) {
        return error.response?.data || { message: 'Error al conectar con el servidor' };
    }
}

export async function getReservas() {
    try {
        const response = await axios.get('/reservas');
        return response.data;
    } catch (error) {
        return error.response?.data || { message: 'Error al conectar con el servidor' };
    }
}

export async function updateReservaEstado(id, estado) {
    try {
        const response = await axios.patch(`/reservas/${id}/estado`, { estado });
        return response.data;
    } catch (error) {
        return error.response?.data || { message: 'Error al conectar con el servidor' };
    }
}

export async function createReserva(reservaData) {
    try {
        const response = await axios.post('/reservas', reservaData);
        return response.data;
    } catch (error) {
        return error.response?.data || { message: 'Error al crear la reserva' };
    }
}

export async function getUsuarios() {
    try {
        const response = await axios.get('/users');
        return response.data;
    } catch (error) {
        return error.response?.data || { message: 'Error al obtener usuarios' };
    }
}

export async function getVehiculos() {
    try {
        const response = await axios.get('/vehiculos');
        return response.data;
    } catch (error) {
        return error.response?.data || { message: 'Error al obtener vehiculos' };
    }
}

export async function getOcupacionVehiculos() {
    try {
        const response = await axios.get('/reservas/ocupacion');
        return response.data;
    } catch (error) {
        return error.response?.data || { message: 'Error al obtener ocupacion' };
    }
}
