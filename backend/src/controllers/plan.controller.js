import * as planService from "../services/plan.service.js";

export async function crearPlan(req, res) {
  try {
    const data = req.body;
    if (!data.nombre || !data.tipo) {
      return res.status(400).json({ success: false, message: "Faltan datos obligatorios (nombre, tipo)" });
    }
    const result = await planService.crearPlan(data);
    res.status(201).json({ success: true, message: "Plan creado correctamente", data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al crear el plan", error: error.message });
  }
}

export async function obtenerPlanes(req, res) {
  try {
    const results = await planService.obtenerPlanes();
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al obtener planes", error: error.message });
  }
}

export async function actualizarPlan(req, res) {
  try {
    const { id } = req.params;
    const data = req.body;
    const result = await planService.actualizarPlan(parseInt(id), data);
    res.status(200).json({ success: true, message: "Plan actualizado correctamente", data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function eliminarPlan(req, res) {
  try {
    const { id } = req.params;
    const result = await planService.eliminarPlan(parseInt(id));
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function cambiarEstadoPlan(req, res) {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const result = await planService.cambiarEstadoPlan(parseInt(id), estado);
    res.status(200).json({ success: true, message: "Estado de plan actualizado", data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}
