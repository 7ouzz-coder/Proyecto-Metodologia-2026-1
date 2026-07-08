import * as preRegistroService from "../services/preregistro.service.js";

const validarRutChileno = (rutCompleto) => {
  if (!rutCompleto) return false;
  let valor = rutCompleto.replace(/\./g, '').replace(/\-/g, '').trim().toUpperCase();
  if (!/^[0-9]+[0-9K]$/.test(valor)) return false;
  
  let cuerpo = valor.slice(0, -1);
  let dv = valor.slice(-1);
  
  let suma = 0;
  let multiplo = 2;
  
  for (let i = 1; i <= cuerpo.length; i++) {
    let index = multiplo * valor.charAt(cuerpo.length - i);
    suma = suma + index;
    if (multiplo < 7) {
      multiplo = multiplo + 1;
    } else {
      multiplo = 2;
    }
  }
  
  let dvEsperado = 11 - (suma % 11);
  dvEsperado = dvEsperado === 11 ? "0" : dvEsperado === 10 ? "K" : dvEsperado.toString();
  
  return dvEsperado === dv;
};

export async function crearPreRegistro(req, res) {
  try {
    const data = req.body;
    
    // Si multer procesó un archivo, guardamos la URL/ruta
    if (req.file) {
      data.comprobantePagoUrl = req.file.filename;
    }

    // Validaciones básicas
    if (!data.nombreCompleto || !data.rut || !data.id_plan || !data.comprobantePagoUrl || !data.email || !data.fechaNacimiento) {
      return res.status(400).json({ message: "Faltan datos obligatorios (nombreCompleto, rut, email, fechaNacimiento, id_plan, comprobante)" });
    }

    // Validación estricta del RUT
    if (!validarRutChileno(data.rut)) {
      return res.status(400).json({ message: "El RUT ingresado no es válido. Por favor verifica los datos." });
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
