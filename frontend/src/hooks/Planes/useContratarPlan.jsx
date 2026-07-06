import Swal from "sweetalert2";
import { contratarPlanService } from "../../services/inscripciones.service.js";
import { getPlanesService } from "../../services/plan.service.js";
import { fireDynamicSwal } from "../utils/dynamicSwal.jsx";
import { gebi } from "../utils/getElementById.jsx";

async function ContratarPlan(planes) {
  const planesOptions = planes.map(plan => 
    `<option value="${plan.id_plan}">${plan.nombre} - $${plan.costo} (${plan.duracion_semanas} semanas)</option>`
  ).join('');

  const today = new Date().toISOString().split('T')[0];

  const { value: formValues } = await Swal.fire({
    title: " Contratar Plan",
    html: `
      <div class="swal2-field m-1">
        <label for="plan-select" class="swal2-label">Selecciona un Plan</label>
        <select id="plan-select" class="swal2-select" required>
          <option value="">-- Seleccione --</option>
          ${planesOptions}
        </select>
      </div>
      <div class="swal2-field m-1">
        <label for="fecha-inicio" class="swal2-label">Fecha de Inicio</label>
        <input id="fecha-inicio" class="swal2-input" type="date" value="${today}" min="${today}" required>
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: " Contratar",
    cancelButtonText: "Cancelar",
    preConfirm: () => {
      const plan_id = parseInt(gebi("plan-select")?.value);
      const fecha_inicio = gebi("fecha-inicio")?.value;

      if (!plan_id) {
        Swal.showValidationMessage("Seleccione un plan");
        return false;
      }

      return { plan_id, fecha_inicio };
    },
    theme: "light",
  });

  if (formValues) {
    return formValues;
  }
}

export const useContratarPlan = (alumno_id, fetchDeudas) => {
  const handleContratarPlan = async () => {
    let response = null;
    try {
    
      const planesResponse = await getPlanesService();
      const planes = planesResponse.data?.data || [];
      
      if (planes.length === 0) {
        Swal.fire({
          title: "Sin planes disponibles",
          text: "No hay planes activos para contratar",
          icon: "info",
          confirmButtonText: "OK",
        });
        return;
      }

      const formValues = await ContratarPlan(planes);
      if (!formValues) return;
      
      response = await contratarPlanService({
        alumno_id,
        plan_id: formValues.plan_id,
        fecha_inicio: formValues.fecha_inicio,
      });
      
      if (typeof fetchDeudas === "function") {
        fetchDeudas();
      }
    } catch (error) {
      console.error(error);
      response = error?.response || { status: 500, message: "Error desconocido" };
    }
    fireDynamicSwal(response.status, null, response?.data?.message || response?.message);
  };

  return {
    handleContratarPlan,
  };
};

export default useContratarPlan;