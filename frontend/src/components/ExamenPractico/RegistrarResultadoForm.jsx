import { useState } from 'react';
import { useRegistrarResultado } from '../../hooks/ExamenPractico/useRegistrarResultado.jsx';
import { CATEGORIAS_FALTAS } from '../../constants/examen.constants.jsx';

export const RegistrarResultadoForm = ({ examen, isOpen, onClose, onSuccess }) => {
    const [resultado, setResultado] = useState('aprobado');
    const [observaciones, setObservaciones] = useState('');
    const [kilometrajeFinal, setKilometrajeFinal] = useState('');

    const {
        codigosMarcados,
        toggleCodigo,
        totales,
        hayReprobatoria,
        loading,
        handleSubmit,
    } = useRegistrarResultado(() => {
        setResultado('aprobado');
        setObservaciones('');
        setKilometrajeFinal('');
        if (onSuccess) onSuccess();
        if (onClose) onClose();
    });

    const onSubmit = (e) => {
        e.preventDefault();
        handleSubmit(examen.id, { resultado, observaciones, kilometrajeFinal });
    };

    const tipoBadge = (tipo) => {
        if (tipo === 'L') return 'badge-warning';
        if (tipo === 'G') return 'badge-error';
        return 'badge-neutral text-white bg-error/80';
    };

    if (!isOpen || !examen) return null;

    return (
        <div className="modal modal-open">
            <div className="modal-box w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">

                {/* Encabezado */}
                <h3 className="font-bold text-lg">Registrar Resultado — Examen #{examen.id}</h3>
                <p className="text-sm text-base-content/60 mb-4">
                    Alumno: <strong>{examen.alumno?.nombre || examen.alumno?.email || '—'}</strong>
                </p>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="form-control">
                        <label className="label"><span className="label-text font-semibold">Resultado *</span></label>
                        <div className="flex gap-4">
                            {['aprobado', 'reprobado'].map((r) => (
                                <label key={r} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        id={`resultado-${r}`}
                                        type="radio"
                                        name="resultado"
                                        className="radio radio-primary"
                                        value={r}
                                        checked={resultado === r || (r === 'reprobado' && hayReprobatoria)}
                                        onChange={() => setResultado(r)}
                                        disabled={hayReprobatoria}
                                    />
                                    <span className="capitalize">{r}</span>
                                </label>
                            ))}
                        </div>
                        {hayReprobatoria && (
                            <p className="text-error text-xs mt-1">
                                ⚠ Se detectaron {totales.reprobatorias} falta(s) reprobatoria(s). El resultado se fuerza a <strong>reprobado</strong>.
                            </p>
                        )}
                    </div>

                    {/* Contador de faltas */}
                    <div className="stats shadow w-full">
                        <div className="stat place-items-center">
                            <div className="stat-title">Faltas Leves (L)</div>
                            <div className="stat-value text-warning">{totales.leves}</div>
                        </div>
                        <div className="stat place-items-center">
                            <div className="stat-title">Faltas Graves (G)</div>
                            <div className="stat-value text-error">{totales.graves}</div>
                        </div>
                        <div className="stat place-items-center">
                            <div className="stat-title">Faltas Reprobatorias (R)</div>
                            <div className="stat-value text-neutral">{totales.reprobatorias}</div>
                        </div>
                    </div>

                    {/* Ficha de faltas por categoría */}
                    <div className="space-y-3">
                        <h4 className="font-semibold text-sm uppercase tracking-wide text-base-content/70">
                            Ficha oficial — Faltas cometidas
                        </h4>
                        {CATEGORIAS_FALTAS.map((cat) => (
                            <div key={cat.categoria} className="collapse collapse-arrow border border-base-300 bg-base-100">
                                <input type="checkbox" />
                                <div className="collapse-title text-sm font-medium">{cat.categoria}</div>
                                <div className="collapse-content">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1">
                                        {cat.faltas.map((falta) => (
                                            <label
                                                key={falta.code}
                                                className="flex items-start gap-2 cursor-pointer hover:bg-base-200 rounded p-1"
                                            >
                                                <input
                                                    id={`falta-${falta.code}`}
                                                    type="checkbox"
                                                    className="checkbox checkbox-sm mt-0.5"
                                                    checked={codigosMarcados.has(falta.code)}
                                                    onChange={() => toggleCodigo(falta.code)}
                                                />
                                                <span className="text-xs leading-snug">
                                                    <span className={`badge badge-xs ${tipoBadge(falta.tipo)} mr-1`}>{falta.code}</span>
                                                    {falta.label}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Observaciones*/}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="form-control">
                            <label className="label"><span className="label-text">Observaciones</span></label>
                            <textarea
                                id="resultado-observaciones"
                                className="textarea textarea-bordered h-20 text-sm"
                                placeholder="Observaciones adicionales del instructor..."
                                value={observaciones}
                                onChange={(e) => setObservaciones(e.target.value)}
                            />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Kilometraje final</span></label>
                            <input
                                id="resultado-kmFinal"
                                type="number"
                                min="0"
                                className="input input-bordered"
                                placeholder="Ej: 45120"
                                value={kilometrajeFinal}
                                onChange={(e) => setKilometrajeFinal(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="modal-action">
                        <button
                            id="resultado-cancelar"
                            type="button"
                            className="btn btn-ghost"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            id="resultado-submit"
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading
                                ? <span className="loading loading-spinner loading-sm" />
                                : 'Guardar resultado'}
                        </button>
                    </div>
                </form>
            </div>
            <div className="modal-backdrop" onClick={onClose} />
        </div>
    );
};

export default RegistrarResultadoForm;
