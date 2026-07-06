import { getVehiculoList } from "../../services/vehiculo.service.js";

export const useGetVehiculoList = (vehiculoList, setVehiculoList) => {
    const fetchVehiculoList = async () => {
        try {
            const data = await getVehiculoList();
            setVehiculoList(data);
        } catch (error) {
            console.error("Error al obtener lista de vehículos:", error);
            setVehiculoList([]);
        }
    };

    return [vehiculoList, fetchVehiculoList];
};
