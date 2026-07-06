import { useState, useCallback } from "react";
import { editAssignsClase } from "../../services/clase.service.js";
import { fireDynamicSwal } from "../utils/dynamicSwal.jsx";
import Swal from "sweetalert2";

export function useEditAsignacion() {
    const [loading, setLoading] = useState(false);

    const editarAsignacion = useCallback(async (id_clase) => {
        if (!id_clase) {
            console.error("id_clase es requerido para editar la asignación");
            return;
        }

        const confirm = await Swal.fire({
            title: "¿Actualizar asignación de esta clase?",
            text: "Se asignarán los estudiantes que aún no estén en esta clase teórica",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Actualizar",
            cancelButtonText: "Cancelar",
            theme: "light",
        });

        if (!confirm.isConfirmed) return;

        setLoading(true);

        try {
            const response = await editAssignsClase(id_clase);
            await fireDynamicSwal(response?.status, null, response?.message);
            return response;
        } catch (error) {
            console.error(error);
            const errorResponse = error?.response || { status: 500, message: "Error al editar la asignación" };
            await fireDynamicSwal(errorResponse?.status, null, errorResponse?.message);
            return errorResponse;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        editarAsignacion,
    };
}