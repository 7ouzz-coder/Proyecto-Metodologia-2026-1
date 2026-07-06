import Swal from "sweetalert2";
import { updatePlanService } from "../../services/plan.service.js";
import { fireDynamicSwal } from "../utils/dynamicSwal.jsx";
import { gebi } from "../utils/getElementById.jsx";
import { createSwalField, createSwalTextarea } from "../utils/swalField.jsx";
import { StaticDropdownList } from "../utils/DropdownList.jsx";
import { TIPO_PLAN } from "../../constants/plan.constants.jsx";

async function EditPlanModal(plan) {
  const { value: formValues } = await Swal.fire({
    title: " Editar Plan",
    html: `
      ${createSwalField(1, "Nombre del Plan", plan.nombre)}
      ${createSwalField(2, "Precio ($)", plan.costo, "number")}
      ${createSwalField(3, "Duración (semanas)", plan.duracion_semanas, "number")}
      ${createSwalField(4, "Total de Clases", plan.clases_totales, "number")}
      ${StaticDropdownList(TIPO_PLAN, "Tipo de Plan", "swal2-input5", "m-1", true)}
      ${createSwalTextarea(6, "Descripción", plan.descripcion || "")}
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Actualizar Plan",
    cancelButtonText: "Cancelar",
    preConfirm: () => {
      const nombre = String(gebi("swal2-input1")?.value);
      const costo = parseFloat(gebi("swal2-input2")?.value);
      const duracion_semanas = parseInt(gebi("swal2-input3")?.value);
      const clases_totales = parseInt(gebi("swal2-input4")?.value);
      const tipo = String(gebi("swal2-input5")?.value);
      const descripcion = String(gebi("swal2-input6")?.value);

      if (!nombre || !costo || !duracion_semanas || !clases_totales) {
        Swal.showValidationMessage(" Todos los campos son obligatorios");
        return false;
      }

      return { nombre, costo, duracion_semanas, descripcion, tipo, clases_totales };
    },
    theme: "light",
  });

  if (formValues) {
    return formValues;
  }
}

export const useEditPlan = (fetchPlanes) => {
  const handleEditPlan = async (plan) => {
    let response = null;
    try {
      const formValues = await EditPlanModal(plan);
      if (!formValues) return;
      response = await updatePlanService(plan.id_plan, formValues);
      if (typeof fetchPlanes === "function") {
        fetchPlanes();
      }
    } catch (error) {
      console.error(error);
      response = error?.response || { status: 500, message: "Error desconocido" };
    }
    fireDynamicSwal(response.status, null, response?.data?.message || response?.message);
  };

  return {
    handleEditPlan,
  };
};

export default useEditPlan;