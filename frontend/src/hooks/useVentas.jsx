import { useState } from 'react';
import { 
    registrarVentaService, 
    obtenerClasesUsuarioService, 
    listarVentasUsuarioService, 
    aprobarVentaService, 
    eliminarVentaService,
    listarVentasService,
    rechazarVentaService,
    obtenerHistorialVentasService
} from '../services/venta.service';

export const useVentas = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const comprarPack = async (ventaData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await registrarVentaService(ventaData);
            return response;
        } catch (err) {
            setError(err.message || 'Error al registrar la compra');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getClasesDisponibles = async (userId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await obtenerClasesUsuarioService(userId);
            return response.data;
        } catch (err) {
            setError(err.message || 'Error al obtener clases disponibles');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getHistorialVentas = async (userId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await listarVentasUsuarioService(userId);
            return response.data;
        } catch (err) {
            setError(err.message || 'Error al obtener el historial de ventas');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const aprobarVenta = async (ventaId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await aprobarVentaService(ventaId);
            return response;
        } catch (err) {
            setError(err.message || 'Error al aprobar la venta');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const rechazarVenta = async (ventaId, motivo) => {
        setLoading(true);
        setError(null);
        try {
            const response = await rechazarVentaService(ventaId, motivo);
            return response;
        } catch (err) {
            setError(err.message || 'Error al rechazar la venta');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getHistorialPreRegistros = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await obtenerHistorialVentasService();
            return response.data;
        } catch (err) {
            setError(err.message || 'Error al obtener el historial');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const eliminarVenta = async (ventaId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await eliminarVentaService(ventaId);
            return response;
        } catch (err) {
            setError(err.message || 'Error al eliminar la venta');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getAllVentas = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await listarVentasService();
            return response.data;
        } catch (err) {
            setError(err.message || 'Error al obtener todas las ventas');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        comprarPack,
        getClasesDisponibles,
        getHistorialVentas,
        getAllVentas,
        getHistorialPreRegistros,
        aprobarVenta,
        rechazarVenta,
        eliminarVenta
    };
};
