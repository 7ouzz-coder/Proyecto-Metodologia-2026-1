import { Router } from 'express';
import { registrarMantenimiento, registrarVehiculo, obtenerVehiculos, obtenerVehiculoPorId, obtenerVehiculosEnMantenimiento, actualizarVehiculo, eliminarVehiculo } from '../controllers/mantenimiento.controller.js';

const router = Router();

router.get('/historial', obtenerVehiculosEnMantenimiento);
router.get('/', obtenerVehiculos);
router.get('/:id', obtenerVehiculoPorId);
router.post('/', registrarMantenimiento);
router.post('/nuevo', registrarVehiculo);
router.put('/:id', actualizarVehiculo);
router.delete('/:id', eliminarVehiculo);

export default router;