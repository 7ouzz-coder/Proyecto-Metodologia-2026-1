import { useState } from 'react';
import { registrarResultado } from '../../services/examen.service.js';
import { fireDynamicSwal } from '../utils/dynamicSwal.jsx';

export const useRegistrarResultado = (onSuccess) => {
    const [codigosMarcados, setCodigosMarcados] = useState(new Set());
    const [loading, setLoading] = useState(false);
    const toggleCodigo = (codigo) => {
        setCodigosMarcados((prev) => {
            const next = new Set(prev);
            if (next.has(codigo)) {
                next.delete(codigo);
            } else {
                next.add(codigo);
            }
            return next;
        });
    };

    const totales = (() => {
        let leves = 0;
        let graves = 0;
        let reprobatorias = 0;
        for (const codigo of codigosMarcados) {
            if (codigo.startsWith('L')) leves++;
            else if (codigo.startsWith('G')) graves++;
            else if (codigo.startsWith('R')) reprobatorias++;
        }
        return { leves, graves, reprobatorias };
    })();

    const hayReprobatoria = totales.reprobatorias > 0;

    const handleSubmit = async (examenId, formData) => {
        setLoading(true);
        try {
            const resultadoFinal = hayReprobatoria ? 'reprobado' : formData.resultado;
            const payload = {
                ...formData,
                resultado: resultadoFinal,
                codigosFaltas: Array.from(codigosMarcados),
            };
            const response = await registrarResultado(examenId, payload);
            await fireDynamicSwal(200, 'Resultado registrado', response?.message || 'El resultado fue guardado en el historial académico.');
            setCodigosMarcados(new Set());
            if (onSuccess) onSuccess();
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || 'Error desconocido al registrar el resultado.';
            const status = err?.response?.status || 500;
            await fireDynamicSwal(status, 'Error', msg);
        } finally {
            setLoading(false);
        }
    };

    return { codigosMarcados, toggleCodigo, totales, hayReprobatoria, loading, handleSubmit };
};
