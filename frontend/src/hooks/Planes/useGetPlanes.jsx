import { useState } from "react";
import { getPlanesService } from "@services/plan.service.js";

export const useGetPlanes = (planesData, setPlanesData) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchPlanes = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getPlanesService();
            console.log("Respuesta de getAllPlanesService:", response);
            
            if (response.status === 200 && response.data?.success) {
                const planes = response.data.data || [];
                setPlanesData(planes);
                return planes;
            } else {
                setPlanesData([]);
                return [];
            }
        } catch (err) {
            console.error("Error en fetchPlanes:", err);
            setError(err.message || "Error al obtener los planes");
            setPlanesData([]);
            return [];
        } finally {
            setLoading(false);
        }
    };

    return [planesData, fetchPlanes, loading, error];
};

export default useGetPlanes;