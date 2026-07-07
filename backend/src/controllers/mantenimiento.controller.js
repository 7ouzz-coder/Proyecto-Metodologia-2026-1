import { registrarEstadoVehiculoService, registrarNuevo, obtenerVehiculos as obtenerVehiculosService, obtenerVehiculoPorId as obtenerVehiculoPorIdService, obtenerVehiculosEnMantenimiento as obtenerVehiculosEnMantenimientoService, actualizarVehiculo as actualizarVehiculoService, eliminarVehiculo as eliminarVehiculoService } from '../services/mantenimiento.service.js';
import { handleSuccess, handleErrorServer, handleErrorClient } from '../Handlers/responseHandlers.js';

export async function registrarMantenimiento(req, res) {
    try {
        const { idVehiculo, nuevoKilometraje, reporteFalla } = req.body;

        const resultado = await registrarEstadoVehiculoService(idVehiculo, nuevoKilometraje, reporteFalla);

        if (resultado.exito) {
            handleSuccess(res, 200, resultado.mensaje, resultado.datos);
        } else {
            res.status(400).json({ status: "Error", message: resultado.mensaje });
        }

    } catch (error) {
        handleErrorServer(res, 500, "Error interno del servidor al registrar el estado del vehículo");
    }
}

export async function registrarVehiculo(req, res) {
    try {
        const { patente, modelo, kilometrajeInicial } = req.body;
        const nuevoVehiculo = await registrarNuevo(patente, modelo, kilometrajeInicial);
        handleSuccess(res, 201, 'Vehículo creado correctamente', nuevoVehiculo);
    } catch (error) {
        if (error.message.includes('kilometraje inicial') || error.message.includes('patente ya existe')) {
            handleErrorClient(res, 400, error.message);
        } else {
            handleErrorServer(res, 500, 'Error interno del servidor al crear el vehículo', error.message);
        }
    }
}

export async function obtenerVehiculosEnMantenimiento(req, res) {
    try {
        const vehiculos = await obtenerVehiculosEnMantenimientoService();
        handleSuccess(res, 200, 'Vehículos en mantenimiento obtenidos correctamente', vehiculos);
    } catch (error) {
        handleErrorServer(res, 500, 'Error interno del servidor al obtener el historial de mantenimiento', error.message);
    }
}

export async function actualizarVehiculo(req, res) {
    try {
        const { id } = req.params;
        const updates = req.body;
        const vehiculo = await actualizarVehiculoService(Number(id), updates);
        handleSuccess(res, 200, 'Vehículo actualizado correctamente', vehiculo);
    } catch (error) {
        if (error.message.includes('no encontrado') || error.message.includes('patente ya existe') || error.message.includes('kilometraje')) {
            handleErrorClient(res, 400, error.message);
        } else {
            handleErrorServer(res, 500, 'Error interno del servidor al actualizar el vehículo', error.message);
        }
    }
}

export async function eliminarVehiculo(req, res) {
    try {
        const { id } = req.params;
        const vehiculo = await eliminarVehiculoService(Number(id));
        handleSuccess(res, 200, 'Vehículo eliminado correctamente', vehiculo);
    } catch (error) {
        if (error.message.includes('no encontrado')) {
            handleErrorClient(res, 404, error.message);
        } else {
            handleErrorServer(res, 500, 'Error interno del servidor al eliminar el vehículo', error.message);
        }
    }
}

export async function obtenerVehiculos(req, res) {
    try {
        const vehiculos = await obtenerVehiculosService();
        handleSuccess(res, 200, 'Vehículos obtenidos correctamente', vehiculos);
    } catch (error) {
        handleErrorServer(res, 500, 'Error interno del servidor al obtener los vehículos', error.message);
    }
}

export async function obtenerVehiculoPorId(req, res) {
    try {
        const { id } = req.params;
        const vehiculo = await obtenerVehiculoPorIdService(Number(id));

        if (!vehiculo) {
            return handleErrorClient(res, 404, 'Vehículo no encontrado');
        }

        handleSuccess(res, 200, 'Vehículo obtenido correctamente', vehiculo);
    } catch (error) {
        handleErrorServer(res, 500, 'Error interno del servidor al obtener el vehículo', error.message);
    }
}
