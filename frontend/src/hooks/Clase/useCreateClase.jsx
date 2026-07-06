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

async function confirmarTipoClase() {
    const { value: result } = await Swal.fire({
        title: "Seleccione el tipo de clase",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Práctica",
        denyButtonText: `Teórica`,
        cancelButtonText: "Cancelar",
        preConfirm: (result) => {
            // console.log("EL RESULTADITO: ", result);
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

/* async function CreateClase() {

  const { value: formValues } = await Swal.fire({
    title: "Crear Nueva Clase",
    html: `
        ${StaticDropdownList(TIPO_CLASE, "Tipo", "swal2-input1", "m-1", false)}
        ${createSwalField(2, "Descripción", "")}
        ${createSwalDateField(3, "fecha", "")} 
        ${createSwalField(4, "Hora de Inicio", "")}
        ${createSwalField(5, "Hora de Término", "")}
        ${StaticDropdownList(DIAS_SEMANA, "Día", "swal2-input6", "m-1", true)}
        ${StaticDropdownList(ESTADO_CLASE, "Estado", "swal2-input7", "m-1", false)}
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Crear",
    cancelButtonText: "Cancelar",
    preConfirm: () => {
      
        const tipo = String(gebi('swal2-input1')?.value);
        const descripcion = String(gebi('swal2-input2')?.value);
        const fecha_clase = gebi('swal2-input3')?.value;
        const hora_inicio = gebi('swal2-input4')?.value;
        const hora_fin = gebi('swal2-input5')?.value;
        const dia = String(gebi('swal2-input6')?.value);
        const estado_clase = String(gebi('swal2-input7')?.value);

      return {tipo, descripcion, fecha_clase, hora_inicio, hora_fin, dia, estado_clase};
    },
    theme: "light",
  });
  if (formValues) {
    return formValues;
  }
}
*/

async function CreateClaseTeorica(profesores) {

  const { value: formValues } = await Swal.fire({
    title: "Crear Nueva Clase",
    html: `
        ${createSwalField(2, "Descripción", "")}
        ${createSwalDateField(3, "fecha", "")} 
        ${createSwalField(4, "Hora de Inicio", "")}
        ${createSwalField(5, "Hora de Término", "")}
        ${StaticDropdownList(DIAS_SEMANA, "Día", "swal2-input6", "m-1", true)}
        ${StaticDropdownList(ESTADO_CLASE, "Estado", "swal2-input7", "m-1", false)}
        ${StaticDropdownList(profesores, "Profesor", "swal2-input8", "m-1", false)}
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Crear",
    cancelButtonText: "Cancelar",
    preConfirm: () => {
        const tipo = CLASE_TEORICA;
        const descripcion = String(gebi('swal2-input2')?.value);
        const fecha_clase = gebi('swal2-input3')?.value;
        const hora_inicio = gebi('swal2-input4')?.value;
        const hora_fin = gebi('swal2-input5')?.value;
        const dia = String(gebi('swal2-input6')?.value);
        const estado_clase = String(gebi('swal2-input7')?.value);
        const email_profesor = getTeacherEmail(String(gebi('swal2-input8')?.value));
        const id_auto = null;
        return {tipo, descripcion, fecha_clase, hora_inicio, hora_fin, dia, estado_clase, email_profesor, id_auto};
    },
    theme: "light",
  });
  if (formValues) {
    return formValues;
  }
}


async function CreateClasePractica(profesores, vehiculos) {
    const { value: formValues } = await Swal.fire({
    title: "Crear Nueva Clase",
    html: `
        ${createSwalField(2, "Descripción", "")}
        ${createSwalDateField(3, "fecha", "")} 
        ${createSwalField(4, "Hora de Inicio", "")}
        ${createSwalField(5, "Hora de Término", "")}
        ${StaticDropdownList(DIAS_SEMANA, "Día", "swal2-input6", "m-1", true)}
        ${StaticDropdownList(ESTADO_CLASE, "Estado", "swal2-input7", "m-1", false)}
        ${StaticDropdownList(profesores, "Profesor", "swal2-input8", "m-1", false)}
        ${StaticDropdownList(vehiculos, "Vehiculo", "swal2-input9", "m-1", false)}
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Crear",
    cancelButtonText: "Cancelar",
    preConfirm: () => {
        const tipo = CLASE_PRACTICA;
        const descripcion = String(gebi('swal2-input2')?.value);
        const fecha_clase = gebi('swal2-input3')?.value;
        const hora_inicio = gebi('swal2-input4')?.value;
        const hora_fin = gebi('swal2-input5')?.value;
        const dia = String(gebi('swal2-input6')?.value);
        const estado_clase = String(gebi('swal2-input7')?.value);
        const email_profesor = getTeacherEmail(String(gebi('swal2-input8')?.value));
        const patente_auto = String(gebi('swal2-input9')?.value);
        return {tipo, descripcion, fecha_clase, hora_inicio, hora_fin, dia, estado_clase, email_profesor, patente_auto};
    },
    theme: "light",
  });
  if (formValues) {
    return formValues;
  }
}

export const useCreateClase = (fetchClases, profesores, vehiculos) => {
    profesores = processTeachers(profesores);
    const handleCreateClase = async () => {
        let response = null;
        try {
            const tipoClase = await confirmarTipoClase();
            let formValues = null;

            if (tipoClase === PRACTICA) {
                // TODO: Crear nuevo Swal para clases prácticas
                console.log("CLASE PRÁCTICA");
                formValues = await CreateClasePractica(profesores, vehiculos);
                formValues = null;
            } else if (tipoClase === TEORICA) {
                // TODO: Crear nuevo Swal para clases teóricas
                console.log("CLASE TEÓRICA");
                formValues = await CreateClaseTeorica(profesores);
                //console.log(profesores);
            } else {
                return;
            }
            
            if(!formValues) return;
            response = await createClaseService(formValues);
            if (typeof(fetchClases) === "function") {
                fetchClases();
            }
            console.log(response);
        } catch (error) {
            console.error(error);
            response = error?.response || {status: 500, message: "Error desconocido"};
        }
        fireDynamicSwal(response.status, null, response?.data?.message || response?.message);
    };

    return {
        handleCreateClase
    };
};
export default useCreateClase;