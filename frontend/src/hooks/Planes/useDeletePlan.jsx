import Swal from "sweetalert2";
import { deletePlanService } from "../../services/plan.service.js";
import { fireDynamicSwal } from "../utils/dynamicSwal.jsx";

export const useDeletePlan = (fetchPlanes) => {
  const handleDeletePlan = async (id_plan, nombrePlan) => {
    const result = await Swal.fire({
      title: "¿Eliminar Plan?",
      text: `¿Estás seguro de eliminar el plan "${nombrePlan}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    let response = null;
    try {
      response = await deletePlanService(id_plan);
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
    handleDeletePlan,
  };
};

export default useDeletePlan;