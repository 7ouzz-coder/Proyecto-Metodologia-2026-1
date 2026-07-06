import { updateEvaluacionService } from "../../services/evaluacion.service.js";
import { alertSuccess, alertError } from "../../helpers/sweetAlert.js";

const useUpdateEvaluacion = (fetchEvaluacion) => {
    const handleUpdateEvaluacion = async (id_evaluacion, evaluacionData) => {
        try {
            const response = await updateEvaluacionService(id_evaluacion, evaluacionData);
            if (response.status === 200) {
                alertSuccess("Evaluación actualizada exitosamente");
                fetchEvaluacion();
                return { success: true, data: response.data };
            }
        } catch (error) {
            const errorMessage = error.message || "Error al actualizar la evaluación";
            alertError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    return { handleUpdateEvaluacion };
};

export default useUpdateEvaluacion;
