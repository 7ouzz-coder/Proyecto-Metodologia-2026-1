
import { getClasesService } from "@services/clase.service.js";

export const useGetClase = (claseData, setClaseData) => {
    const fetchClase = async () => {
        try {
            const data = await getClasesService();
            if (data[1]) {
                throw Error(data[1], data);
            }
            setClaseData(data[0]);
        } catch (error) {
            // console.error('Error al conseguir la clase data:', error);
        } 
    };


    return [claseData, fetchClase];
};

export default useGetClase;