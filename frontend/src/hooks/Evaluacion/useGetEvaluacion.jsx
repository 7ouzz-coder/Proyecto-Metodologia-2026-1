import { useEffect } from "react";
import { getEvaluacionesService } from "../../services/evaluacion.service.js";

export const useGetEvaluacion = (evaluacionData, setEvaluacionData) => {
    const fetchEvaluacion = async () => {
        try {
            const data = await getEvaluacionesService();
            setEvaluacionData(data);
        } catch (error) {
            console.error("Error al obtener evaluaciones:", error);
            setEvaluacionData([]);
        }
    };

    return [evaluacionData, fetchEvaluacion];
};
