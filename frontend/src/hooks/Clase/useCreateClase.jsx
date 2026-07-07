import { createClaseService } from "@services/clase.service.js";
import Swal from "sweetalert2";
import { createSwalField, createSwalDateField } from "../utils/swalField.jsx";
import { gebi } from "../utils/getElementById.jsx";
import { fireDynamicSwal } from "../utils/dynamicSwal.jsx";
import { StaticDropdownList } from "../utils/DropdownList.jsx";
import { DIAS_SEMANA, TIPO_CLASE, ESTADO_CLASE, CLASE_TEORICA, CLASE_PRACTICA } from "../../constants/clase.constants.jsx";
import { getTeacherEmail, processTeachers } from "../../utils/ClaseUtils.js";

const PRACTICA = 1;
const TEORICA = 0;
const CANCELADA = -1;

// Helper: genera HTML para selección múltiple de alumnos (RF2 - clase teórica)
function createMultipleStudentSelect(alumnos, id) {
    if (!Array.isArray(alumnos) || alumnos.length === 0) {
        return `<p class="text-sm text-gray-400 m-1">No hay alumnos activos disponibles.</p>`;
    }
    const options = alumnos.map(a =>
        `<option value="${a.id}">${a.nombre} (${a.email})</option>`
    ).join("");
    return `
        <div class="mb-3 text-left">
            <label class="block text-sm font-medium text-gray-700 mb-1">Alumnos (selección múltiple)</label>
            <select id="${id}" multiple class="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white" style="height:120px;">
                ${options}
            </select>
            <p class="text-xs text-gray-400 mt-1">Mantén Ctrl/Cmd para seleccionar varios</p>
        </div>
    `;
}

async function confirmarTipoClase() {
    const { value: result } = await Swal.fire({
        title: "Seleccione el tipo de clase",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Práctica",
        denyButtonText: `Teórica`,
        cancelButtonText: "Cancelar",
        preConfirm: (result) => {
            if (result === true) {
                return PRACTICA;
            } else if (result === false) {
                return TEORICA;
            }
            return CANCELADA;
        }
    });

    return Number(result);
}

// RF2: Clase Teórica — oculta vehículo, habilita selección múltiple de alumnos
async function CreateClaseTeorica(profesores, alumnos) {
    const alumnoSelectId = "swal2-alumnos-teorica";

    const { value: formValues } = await Swal.fire({
        title: "Crear Nueva Clase Teórica",
        html: `
            ${createSwalField(2, "Descripción", "")}
            ${createSwalDateField(3, "fecha", "")} 
            ${createSwalField(4, "Hora de Inicio", "")}
            ${createSwalField(5, "Hora de Término", "")}
            ${StaticDropdownList(DIAS_SEMANA, "Día", "swal2-input6", "m-1", true)}
            ${StaticDropdownList(ESTADO_CLASE, "Estado", "swal2-input7", "m-1", false)}
            ${StaticDropdownList(profesores, "Profesor", "swal2-input8", "m-1", false)}
            ${createMultipleStudentSelect(alumnos, alumnoSelectId)}
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Crear",
        cancelButtonText: "Cancelar",
        preConfirm: () => {
            const descripcion = String(gebi('swal2-input2')?.value || "").trim();
            const fecha_clase = gebi('swal2-input3')?.value;
            const hora_inicio = gebi('swal2-input4')?.value;
            const hora_fin = gebi('swal2-input5')?.value;
            const dia = String(gebi('swal2-input6')?.value);
            const estado_clase = String(gebi('swal2-input7')?.value);
            const email_profesor = getTeacherEmail(String(gebi('swal2-input8')?.value));
            const id_auto = null;

            // Validaciones básicas
            if (!descripcion || !fecha_clase || !hora_inicio || !hora_fin) {
                Swal.showValidationMessage("Por favor completa todos los campos obligatorios.");
                return false;
            }

            // RF2: Obtener IDs de alumnos seleccionados (selección múltiple)
            const selectEl = document.getElementById(alumnoSelectId);
            const ids_alumnos = selectEl
                ? Array.from(selectEl.selectedOptions).map(o => Number(o.value))
                : [];

            return { tipo: CLASE_TEORICA, descripcion, fecha_clase, hora_inicio, hora_fin, dia, estado_clase, email_profesor, id_auto, ids_alumnos };
        },
        theme: "light",
        customClass: {
            confirmButton: 'bg-indigo-600 text-white font-medium px-5 py-2 rounded hover:bg-indigo-700 mx-2 transition-colors',
            cancelButton: 'bg-gray-200 text-gray-800 font-medium px-5 py-2 rounded hover:bg-gray-300 mx-2 transition-colors',
            popup: 'rounded-xl shadow-xl'
        },
        buttonsStyling: false
    });
    if (formValues) {
        return formValues;
    }
}

// RF2: Clase Práctica — exige vehículo, restringe a 1 solo alumno
async function CreateClasePractica(profesores, vehiculos, alumnos) {
    const { value: formValues } = await Swal.fire({
        title: "Crear Nueva Clase Práctica",
        html: `
            ${createSwalField(2, "Descripción", "")}
            ${createSwalDateField(3, "fecha", "")} 
            ${createSwalField(4, "Hora de Inicio", "")}
            ${createSwalField(5, "Hora de Término", "")}
            ${StaticDropdownList(DIAS_SEMANA, "Día", "swal2-input6", "m-1", true)}
            ${StaticDropdownList(ESTADO_CLASE, "Estado", "swal2-input7", "m-1", false)}
            ${StaticDropdownList(profesores, "Profesor", "swal2-input8", "m-1", false)}
            ${StaticDropdownList(vehiculos, "Vehículo (patente)", "swal2-input9", "m-1", false)}
            ${StaticDropdownList(
                Array.isArray(alumnos) ? alumnos.map(a => `${a.nombre} (${a.email})`) : [],
                "Alumno (1 cupo)",
                "swal2-input10",
                "m-1",
                false
            )}
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Crear",
        cancelButtonText: "Cancelar",
        preConfirm: () => {
            const descripcion = String(gebi('swal2-input2')?.value || "").trim();
            const fecha_clase = gebi('swal2-input3')?.value;
            const hora_inicio = gebi('swal2-input4')?.value;
            const hora_fin = gebi('swal2-input5')?.value;
            const dia = String(gebi('swal2-input6')?.value);
            const estado_clase = String(gebi('swal2-input7')?.value);
            const email_profesor = getTeacherEmail(String(gebi('swal2-input8')?.value));
            const patente_auto = String(gebi('swal2-input9')?.value);

            // Validaciones básicas
            if (!descripcion || !fecha_clase || !hora_inicio || !hora_fin) {
                Swal.showValidationMessage("Por favor completa todos los campos obligatorios.");
                return false;
            }
            if (!patente_auto || patente_auto === "Vehículo (patente)") {
                Swal.showValidationMessage("Debes seleccionar un vehículo para la clase práctica.");
                return false;
            }

            // RF2: Restricción de 1 solo alumno para clase práctica
            const alumnoSeleccionado = gebi('swal2-input10')?.value;
            if (!alumnoSeleccionado || alumnoSeleccionado === "Alumno (1 cupo)") {
                Swal.showValidationMessage("Debes seleccionar un alumno para la clase práctica.");
                return false;
            }
            // Extraer email del alumno seleccionado (formato: "Nombre (email)")
            const email_alumno = getTeacherEmail(alumnoSeleccionado);

            return { tipo: CLASE_PRACTICA, descripcion, fecha_clase, hora_inicio, hora_fin, dia, estado_clase, email_profesor, patente_auto, email_alumno };
        },
        theme: "light",
        customClass: {
            confirmButton: 'bg-indigo-600 text-white font-medium px-5 py-2 rounded hover:bg-indigo-700 mx-2 transition-colors',
            cancelButton: 'bg-gray-200 text-gray-800 font-medium px-5 py-2 rounded hover:bg-gray-300 mx-2 transition-colors',
            popup: 'rounded-xl shadow-xl'
        },
        buttonsStyling: false
    });
    if (formValues) {
        return formValues;
    }
}

export const useCreateClase = (fetchClases, profesores, vehiculos, alumnos) => {
    profesores = processTeachers(profesores);
    const handleCreateClase = async () => {
        let response = null;
        try {
            const tipoClase = await confirmarTipoClase();
            let formValues = null;

            if (tipoClase === PRACTICA) {
                // RF2: Formulario de clase práctica — vehículo obligatorio, 1 alumno
                formValues = await CreateClasePractica(profesores, vehiculos, alumnos);
            } else if (tipoClase === TEORICA) {
                // RF2: Formulario de clase teórica — sin vehículo, selección múltiple de alumnos
                formValues = await CreateClaseTeorica(profesores, alumnos);
            } else {
                return;
            }
            
            if (!formValues) return;

            // RF3: Persistir en base de datos y notificar resultado
            response = await createClaseService(formValues);
            if (typeof(fetchClases) === "function") {
                fetchClases();
            }
            console.log(response);
        } catch (error) {
            console.error(error);
            response = error?.response || {status: 500, message: "Error desconocido"};
        }
        // RF3: Notificación automática tras guardar
        fireDynamicSwal(response.status, null, response?.data?.message || response?.message);
    };

    return {
        handleCreateClase
    };
};
export default useCreateClase;