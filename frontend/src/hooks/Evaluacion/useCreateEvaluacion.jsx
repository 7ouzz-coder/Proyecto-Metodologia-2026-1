import { createEvaluacionService } from "../../services/evaluacion.service.js";
import { alertSuccess, alertError } from "../../helpers/sweetAlert.js";

const useCreateEvaluacion = (fetchEvaluacion) => {
    const handleCreateEvaluacion = async (evaluacionData) => {
        try {
            const response = await createEvaluacionService(evaluacionData);
            if (response.status === 201) {
                alertSuccess("Evaluación creada exitosamente");
                fetchEvaluacion();
                return { success: true, data: response.data };
            }
        } catch (error) {
            const errorMessage = error.message || "Error al crear la evaluación";
            alertError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    return { handleCreateEvaluacion };
};

export default useCreateEvaluacion;
