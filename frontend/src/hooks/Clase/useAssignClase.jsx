import { useState, useCallback } from "react";
import { assignsClaseService } from "../../services/clase.service.js";
import { fireDynamicSwal } from "../utils/dynamicSwal.jsx";
import Swal from "sweetalert2";

export function useAsignarPorLote(){
    const [loading, setLoading] = useState(false);

    const asignarPorLote = useCallback(async ()=>{
        const confirm = await Swal.fire({
            title: "¿ Asignar estudiantes por lote ?",
            text: 'Se asignaran todos los estudiantes al archivo clases teóricas disponibles',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Asignar',
            cancelButtonText: 'Cancelar',
            theme: 'light',

        });

        if(!confirm.isConfirmed) return;

        setLoading(true);

        let response = null;

        try {
            response = await assignsClaseService({});
            await fireDynamicSwal(response?.status, null, response?.message);
            return response;
        } catch (error) {
            console.error(error);
            response = error?.response || {status: 500, message: "Error de asignacion por lote"};
        }
    }, []);

    return {
        loading,
        asignarPorLote,
    };
}