import Swal from "sweetalert2";
import { EditarPlanStatusService } from "../../services/plan.service.js";
import { fireDynamicSwal } from "../utils/dynamicSwal.jsx";

export const useEditarPlanStatus = (fetchPlanes) => {
  const handleEditarStatus = async (id_plan, estadoActual) => {
    const nuevoEstado = estadoActual === "activo" ? "inactivo" : "activo";
    const accion = nuevoEstado === "activo" ? "activar" : "desactivar";

    const result = await Swal.fire({
      title: `¿${accion === "activar" ? "Activar" : "Desactivar"} Plan?`,
      text: `¿Estás seguro de ${accion} este plan?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: `Sí, ${accion}`,
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    let response = null;
    try {
      response = await EditarPlanStatusService(id_plan, nuevoEstado);
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
    handleEditarStatus,
  };
};

export default useEditarPlanStatus;