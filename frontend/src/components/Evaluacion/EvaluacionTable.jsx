import { RESULTADOS_MANEJO, RESULTADOS_EVALUACION } from "../../constants/evaluacion.constants.jsx";

export const EvaluacionTable = ({
    data,
    onEdit,
    onDelete,
    isLoading = false,
}) => {
    const getResultadoManejoLabel = (value) => {
        return RESULTADOS_MANEJO.find((r) => r.value === value)?.label || "N/A";
    };

    const getResultadoLabel = (value) => {
        return RESULTADOS_EVALUACION.find((r) => r.value === value)?.label || value;
    };

    if (!data || data.length === 0) {
        return (
            <div className="alert alert-info">
                <span>No hay evaluaciones registradas</span>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
                <thead>
                    <tr>
                        <th>Alumno</th>
                        <th>Calif. Teórica</th>
                        <th>Manejo</th>
                        <th>Resultado</th>
                        <th>Comentario</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((evaluacion) => (
                        <tr key={evaluacion.id_evaluacion}>
                            <td className="font-semibold">{evaluacion.alumno}</td>
                            <td>
                                <span className="badge badge-lg">
                                    {evaluacion.calificacion_teorica}/{38}
                                </span>
                            </td>
                            <td>
                                <div className="flex flex-col gap-1 text-xs">
                                    <span>
                                        M1: {getResultadoManejoLabel(evaluacion.resultado_manejo_1)}
                                    </span>
                                    <span>
                                        M2: {getResultadoManejoLabel(evaluacion.resultado_manejo_2)}
                                    </span>
                                    <span>
                                        M3: {getResultadoManejoLabel(evaluacion.resultado_manejo_3)}
                                    </span>
                                </div>
                            </td>
                            <td>
                                <span
                                    className={`badge badge-lg ${
                                        evaluacion.Resultado === "aprobado"
                                            ? "badge-success"
                                            : evaluacion.Resultado === "reprobado"
                                                ? "badge-error"
                                                : "badge-warning"
                                    }`}
                                >
                                    {getResultadoLabel(evaluacion.Resultado)}
                                </span>
                            </td>
                            <td className="max-w-xs truncate text-sm">
                                {evaluacion.comentario || "-"}
                            </td>
                            <td className="space-x-2">
                                <button
                                    onClick={() => onEdit(evaluacion)}
                                    className="btn btn-sm btn-info"
                                    disabled={isLoading}
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => onDelete(evaluacion.id_evaluacion)}
                                    className="btn btn-sm btn-error"
                                    disabled={isLoading}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
