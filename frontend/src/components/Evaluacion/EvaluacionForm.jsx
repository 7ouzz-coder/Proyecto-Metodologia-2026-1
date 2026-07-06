import { useState } from "react";
import {
    EVALUACION_CAMPOS,
    RESULTADOS_MANEJO,
    RESULTADOS_EVALUACION,
    MAX_CALIFICACION_TEORICA,
    MIN_CALIFICACION_TEORICA,
} from "../../constants/evaluacion.constants.jsx";

export const EvaluacionForm = ({ evaluacion, onSubmit, onCancel, isLoading = false }) => {
    const [formData, setFormData] = useState(
        evaluacion || {
            [EVALUACION_CAMPOS.ALUMNO]: "",
            [EVALUACION_CAMPOS.CALIFICACION_TEORICA]: 0,
            [EVALUACION_CAMPOS.RESULTADO_MANEJO_1]: 0,
            [EVALUACION_CAMPOS.RESULTADO_MANEJO_2]: 0,
            [EVALUACION_CAMPOS.RESULTADO_MANEJO_3]: 0,
            [EVALUACION_CAMPOS.RESULTADO_MANEJO_4]: 0,
            [EVALUACION_CAMPOS.RESULTADO_MANEJO_5]: 0,
            [EVALUACION_CAMPOS.RESULTADO]: "evaluando",
            [EVALUACION_CAMPOS.COMENTARIO]: "",
        }
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === EVALUACION_CAMPOS.CALIFICACION_TEORICA
                ? parseInt(value)
                : name.includes("resultado_manejo")
                    ? parseInt(value)
                    : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="modal-box">
            <div className="modal-header">
                <h3 className="font-bold text-lg">
                    {evaluacion ? "Editar Evaluación" : "Nueva Evaluación"}
                </h3>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
                {/* Alumno */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Nombre del Alumno *</span>
                    </label>
                    <input
                        type="text"
                        name={EVALUACION_CAMPOS.ALUMNO}
                        value={formData[EVALUACION_CAMPOS.ALUMNO]}
                        onChange={handleChange}
                        placeholder="Ingrese nombre del alumno"
                        className="input input-bordered"
                        required
                    />
                </div>

                {/* Calificación Teórica */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">
                            Calificación Teórica (0-{MAX_CALIFICACION_TEORICA}) *
                        </span>
                    </label>
                    <input
                        type="number"
                        name={EVALUACION_CAMPOS.CALIFICACION_TEORICA}
                        value={formData[EVALUACION_CAMPOS.CALIFICACION_TEORICA]}
                        onChange={handleChange}
                        min={MIN_CALIFICACION_TEORICA}
                        max={MAX_CALIFICACION_TEORICA}
                        className="input input-bordered"
                        required
                    />
                </div>

                {/* Resultados de Manejo */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Resultados de Manejo</span>
                    </label>
                    {[1, 2, 3, 4, 5].map((num) => (
                        <div key={num} className="mb-3">
                            <label className="label">
                                <span className="label-text-alt">Manejo {num}</span>
                            </label>
                            <select
                                name={`resultado_manejo_${num}`}
                                value={formData[`resultado_manejo_${num}`]}
                                onChange={handleChange}
                                className="select select-bordered select-sm"
                            >
                                {RESULTADOS_MANEJO.map((resultado) => (
                                    <option key={resultado.value} value={resultado.value}>
                                        {resultado.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>

                {/* Resultado General */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Resultado General *</span>
                    </label>
                    <select
                        name={EVALUACION_CAMPOS.RESULTADO}
                        value={formData[EVALUACION_CAMPOS.RESULTADO]}
                        onChange={handleChange}
                        className="select select-bordered"
                        required
                    >
                        {RESULTADOS_EVALUACION.map((resultado) => (
                            <option key={resultado.value} value={resultado.value}>
                                {resultado.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Comentario */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Comentario</span>
                    </label>
                    <textarea
                        name={EVALUACION_CAMPOS.COMENTARIO}
                        value={formData[EVALUACION_CAMPOS.COMENTARIO]}
                        onChange={handleChange}
                        placeholder="Observaciones sobre la evaluación"
                        className="textarea textarea-bordered"
                        rows="3"
                    ></textarea>
                </div>

                {/* Botones */}
                <div className="modal-action gap-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="btn btn-outline"
                        disabled={isLoading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isLoading}
                    >
                        {isLoading ? "Guardando..." : "Guardar"}
                    </button>
                </div>
            </form>
        </div>
    );
};
