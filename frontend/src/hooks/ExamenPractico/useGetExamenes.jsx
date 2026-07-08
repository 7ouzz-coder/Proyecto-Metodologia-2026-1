import { getExamenes } from '../../services/examen.service.js';

export const useGetExamenes = (examenesData, setExamenesData) => {
    const fetchExamenes = async () => {
        try {
            const response = await getExamenes();
            const data = response?.data ?? response ?? [];
            setExamenesData(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error al obtener exámenes:', error);
            setExamenesData([]);
        }
    };

    return [examenesData, fetchExamenes];
};
