import * as preRegistroService from "../services/preregistro.service.js";

export async function crearPreRegistro(req, res) {
  try {
    const data = req.body;
    // Validaciones básicas
    if (!data.nombreCompleto || !data.rut || !data.plan || !data.comprobantePagoUrl || !data.email || !data.fechaNacimiento) {
      return res.status(400).json({ message: "Faltan datos obligatorios (nombreCompleto, rut, email, fechaNacimiento, plan, comprobante)" });
    }
    const result = await preRegistroService.crearPreRegistro(data);
    res.status(201).json({ message: "Preinscripción enviada correctamente", data: result });
  } catch (error) {
    res.status(500).json({ message: "Error al crear la preinscripción", error: error.message });
  }
}

export async function obtenerPreRegistrosPendientes(req, res) {
  try {
    const results = await preRegistroService.obtenerPreRegistrosPendientes();
    res.status(200).json({ data: results });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener solicitudes", error: error.message });
  }
}

export async function obtenerHistorialPreRegistros(req, res) {
  try {
    const results = await preRegistroService.obtenerHistorialPreRegistros();
    res.status(200).json({ data: results });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener historial", error: error.message });
  }
}

export async function aprobarPreRegistro(req, res) {
  try {
    const { id } = req.params;
    const result = await preRegistroService.aprobarPreRegistro(parseInt(id));
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function rechazarPreRegistro(req, res) {
  try {
    const { id } = req.params;
    const { motivo } = req.body;
    const result = await preRegistroService.rechazarPreRegistro(parseInt(id), motivo);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
