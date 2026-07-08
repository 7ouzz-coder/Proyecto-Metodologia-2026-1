import { useState } from 'react';
import { useProgramarExamen } from '../../hooks/ExamenPractico/useProgramarExamen.jsx';
import { TIPOS_VEHICULO } from '../../constants/examen.constants.jsx';

const INITIAL_FORM = {
    alumnoId: '',
    instructorId: '',
    vehiculoId: '',
    fechaHoraInicio: '',
    fechaHoraFin: '',
    tipoVehiculo: '',
    marcaModelo: '',
    kilometrajeInicial: '',
};

const FieldInput = ({ id, label, name, type = 'text', value, onChange, required, min, placeholder }) => (
    <label className="form-control w-full">
        <div className="label"><span className="label-text">{label}{required ? ' *' : ''}</span></div>
        <input
            id={id}
            name={name}
            type={type}
            className="input input-bordered w-full"
            value={value}
            onChange={onChange}
            required={required}
            min={min}
            placeholder={placeholder}
        />
    </label>
);

export const ProgramarExamenForm = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState(INITIAL_FORM);
    const { alumnos, profesores, loading, loadingLists, handleSubmit } = useProgramarExamen(() => {
        setFormData(INITIAL_FORM);
        if (onSuccess) onSuccess();
        if (onClose) onClose();
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        handleSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="modal modal-open">
            <div className="modal-box w-11/12 max-w-2xl">
                <h3 className="font-bold text-lg mb-4">Programar Examen Práctico</h3>

                {loadingLists ? (
                    <div className="flex justify-center py-8">
                        <span className="loading loading-spinner loading-md" />
                    </div>
                ) : (
                    <form onSubmit={handleFormSubmit} className="space-y-3">
                        <label className="form-control w-full">
                            <div className="label"><span className="label-text">Alumno *</span></div>
                            <select
                                id="programar-alumnoId"
                                name="alumnoId"
                                className="select select-bordered w-full"
                                value={formData.alumnoId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">— Seleccione un alumno —</option>
                                {alumnos.map((a) => (
                                    <option key={a.id} value={a.id}>
                                        {a.nombre || a.email} {a.nombre ? `(${a.email})` : ''}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="form-control w-full">
                            <div className="label"><span className="label-text">Instructor evaluador *</span></div>
                            <select
                                id="programar-instructorId"
                                name="instructorId"
                                className="select select-bordered w-full"
                                value={formData.instructorId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">— Seleccione un instructor —</option>
                                {profesores.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.nombre || p.email} {p.nombre ? `(${p.email})` : ''}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <FieldInput
                            id="programar-vehiculoId"
                            label="Patente del vehículo"
                            name="vehiculoId"
                            type="text"
                            placeholder="Ej: BBBB11"
                            value={formData.vehiculoId}
                            onChange={handleChange}
                            required
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <FieldInput
                                id="programar-fechaInicio"
                                label="Fecha y hora de inicio"
                                name="fechaHoraInicio"
                                type="datetime-local"
                                value={formData.fechaHoraInicio}
                                onChange={handleChange}
                                required
                            />
                            <FieldInput
                                id="programar-fechaFin"
                                label="Fecha y hora de término"
                                name="fechaHoraFin"
                                type="datetime-local"
                                value={formData.fechaHoraFin}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <label className="form-control w-full">
                            <div className="label"><span className="label-text">Tipo de vehículo</span></div>
                            <select
                                id="programar-tipoVehiculo"
                                name="tipoVehiculo"
                                className="select select-bordered w-full"
                                value={formData.tipoVehiculo}
                                onChange={handleChange}
                            >
                                <option value="">— Opcional —</option>
                                {TIPOS_VEHICULO.map((t) => (
                                    <option key={t.value} value={t.value}>{t.label}</option>
                                ))}
                            </select>
                        </label>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <FieldInput
                                id="programar-marcaModelo"
                                label="Marca / Modelo"
                                name="marcaModelo"
                                type="text"
                                placeholder="Ej: Hyundai Accent"
                                value={formData.marcaModelo}
                                onChange={handleChange}
                            />
                            <FieldInput
                                id="programar-kmInicial"
                                label="Kilometraje inicial"
                                name="kilometrajeInicial"
                                type="number"
                                min="0"
                                placeholder="Ej: 45000"
                                value={formData.kilometrajeInicial}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="modal-action mt-2">
                            <button
                                id="programar-cancelar"
                                type="button"
                                className="btn btn-ghost"
                                onClick={onClose}
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                            <button
                                id="programar-submit"
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? <span className="loading loading-spinner loading-sm" /> : 'Programar examen'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
            <div className="modal-backdrop" onClick={onClose} />
        </div>
    );
};

export default ProgramarExamenForm;
