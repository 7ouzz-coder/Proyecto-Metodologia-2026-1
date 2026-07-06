import { deleteEvaluacionService } from "../../services/evaluacion.service.js";
import { alertSuccess, alertError, confirmDelete } from "../../helpers/sweetAlert.js";

const useDeleteEvaluacion = (fetchEvaluacion) => {
    const handleDeleteEvaluacion = async (id_evaluacion) => {
        try {
            const isConfirmed = await confirmDelete("¿Está seguro que desea eliminar esta evaluación?");
            if (!isConfirmed) return;

            const response = await deleteEvaluacionService(id_evaluacion);
            if (response.status === 200) {
                alertSuccess("Evaluación eliminada exitosamente");
                fetchEvaluacion();
                return { success: true };
            }
        } catch (error) {
            const errorMessage = error.message || "Error al eliminar la evaluación";
            alertError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    return { handleDeleteEvaluacion };
};

export default useDeleteEvaluacion;
