import axios from './root.service.js';

export async function getVehiculos() {
    try {
        const response = await axios.get('/vehiculos');
        return response.data;
    } catch (error) {
        return error.response?.data || { message: 'Error al obtener vehiculos' };
    }
}

export async function createVehiculo(vehiculoData) {
    try {
        const response = await axios.post('/vehiculos', vehiculoData);
        return response.data;
    } catch (error) {
        return error.response?.data || { message: 'Error al crear vehiculo' };
    }
}

export async function deleteVehiculo(id) {
    try {
        const response = await axios.delete(`/vehiculos/${id}`);
        return response.data;
    } catch (error) {
        return error.response?.data || { message: 'Error al eliminar vehiculo' };
    }
}

export async function updateVehiculo(id, vehiculoData) {
    try {
        const response = await axios.patch(`/vehiculos/${id}`, vehiculoData);
        return response.data;
    } catch (error) {
        return error.response?.data || { message: 'Error al actualizar vehiculo' };
    }
}

export const getVehiculoList = async () => {
    try {
        const response = await axios.get(`/vehiculos/frontend/getVehiculoList`);
        return response?.data?.data || [];
    } catch (error) {
        console.error(error);
        return [];
    }        
}