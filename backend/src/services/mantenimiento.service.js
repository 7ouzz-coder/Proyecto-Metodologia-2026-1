import { AppDataSource } from "../config/configDB.js";
import { Vehiculo } from "../entities/vehiculo.entity.js";

export async function registrarNuevo(patente, modelo, kilometrajeInicial) {
    const kilometraje = Number(kilometrajeInicial);

    if (isNaN(kilometraje) || kilometraje < 0) {
        throw new Error("El kilometraje inicial no puede ser negativo.");
    }

    const vehiculoRepository = AppDataSource.getRepository(Vehiculo);
    const existente = await vehiculoRepository.findOneBy({ patente });

    if (existente) {
        throw new Error("La patente ya existe en el sistema.");
    }

    const nuevoVehiculo = vehiculoRepository.create({
        patente,
        modelo,
        kilometraje,
        estado: "Activo",
    });

    return await vehiculoRepository.save(nuevoVehiculo);
}

export async function obtenerVehiculos() {
    const vehiculoRepository = AppDataSource.getRepository(Vehiculo);
    return await vehiculoRepository.find();
}

export async function obtenerVehiculosEnMantenimiento() {
    const vehiculoRepository = AppDataSource.getRepository(Vehiculo);
    return await vehiculoRepository.find({ where: { estado: "En Mantenimiento" } });
}

export async function obtenerVehiculoPorId(id) {
    const vehiculoRepository = AppDataSource.getRepository(Vehiculo);
    return await vehiculoRepository.findOneBy({ id });
}

export async function actualizarVehiculo(id, updates) {
    const vehiculoRepository = AppDataSource.getRepository(Vehiculo);
    const vehiculo = await vehiculoRepository.findOneBy({ id });

    if (!vehiculo) {
        throw new Error("Vehículo no encontrado");
    }

    if (updates.patente && updates.patente !== vehiculo.patente) {
        const existente = await vehiculoRepository.findOneBy({ patente: updates.patente });
        if (existente) {
            throw new Error("La patente ya existe en el sistema.");
        }
        vehiculo.patente = updates.patente;
    }

    if (updates.modelo) {
        vehiculo.modelo = updates.modelo;
    }

    if (updates.kilometraje !== undefined && updates.kilometraje !== null) {
        const kilometraje = Number(updates.kilometraje);
        if (isNaN(kilometraje) || kilometraje < 0) {
            throw new Error("El kilometraje no puede ser negativo.");
        }
        vehiculo.kilometraje = kilometraje;
    }

    if (updates.estado) {
        vehiculo.estado = updates.estado;
    }

    return await vehiculoRepository.save(vehiculo);
}

export async function eliminarVehiculo(id) {
    const vehiculoRepository = AppDataSource.getRepository(Vehiculo);
    const vehiculo = await vehiculoRepository.findOneBy({ id });

    if (!vehiculo) {
        throw new Error("Vehículo no encontrado");
    }

    await vehiculoRepository.remove(vehiculo);
    return vehiculo;
}

export async function registrarEstadoVehiculoService(idVehiculo, nuevoKilometraje, reporteFalla) {
    try {
        const vehiculoRepository = AppDataSource.getRepository(Vehiculo);
        const vehiculo = await vehiculoRepository.findOneBy({ id: idVehiculo });

        if (!vehiculo) {
            return { exito: false, mensaje: "El vehículo no existe en el sistema." };
        }

        //  Validación Automática de Odómetro
        if (nuevoKilometraje <= vehiculo.kilometraje) {
            return { 
                exito: false, 
                mensaje: `Error: El kilometraje de término (${nuevoKilometraje} km) debe ser mayor al último registro (${vehiculo.kilometraje} km).` 
            };
        }

        vehiculo.kilometraje = nuevoKilometraje;
        let alertaEnviada = false;

        //  Gestión de Fallas y Notificación
        if (reporteFalla && reporteFalla.gravedad) {
            // Actualmente la entidad Vehiculo no almacena historial de fallas. 
            // Si la falla es grave, cambiamos el estado a Inactivo (o En Mantenimiento).
            if (reporteFalla.gravedad === 'Alta') {
                vehiculo.estado = 'Inactivo';
                alertaEnviada = true;
                console.log(`[NOTIFICACIÓN] Alerta: El vehículo ${vehiculo.patente} ha sido puesto 'Inactivo' por falla grave.`);
            }
        }

        await vehiculoRepository.save(vehiculo);

        return {
            exito: true,
            mensaje: alertaEnviada 
                ? `Registro exitoso. ALERTA: Vehículo ${vehiculo.patente} bloqueado por fallas.`
                : `Estado del vehículo actualizado correctamente.`,
            datos: {
                id: vehiculo.id,
                kilometrajeActualizado: vehiculo.kilometraje,
                estadoFinal: vehiculo.estado
            }
        };

    } catch (error) {
        throw new Error(error.message);
    }
}