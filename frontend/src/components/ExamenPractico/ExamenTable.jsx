import { ESTADOS_EXAMEN } from '../../constants/examen.constants.jsx';
import { DUPageBrowser } from '../daisyui/DUPageBrowser.jsx';
import { useState } from 'react';

const PAGE_SIZE = 8;

export const ExamenTable = ({ examenes = [], showAcciones = false, onRegistrar, esProfesor = false }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const pageAmount = Math.max(1, Math.ceil(examenes.length / PAGE_SIZE));
    const paginated = examenes.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const formatFecha = (iso) => {
        if (!iso) return '—';
        return new Date(iso).toLocaleString('es-CL', {
            dateStyle: 'short',
            timeStyle: 'short',
        });
    };

    const nombreCompleto = (user) => {
        if (!user) return '—';
        return user.nombre || user.email || `ID ${user.id}`;
    };

    return (
        <div className="overflow-x-auto w-full">
            <table className="table table-zebra w-full">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Alumno</th>
                        <th>Instructor</th>
                        <th>Vehículo</th>
                        <th>Inicio</th>
                        <th>Término</th>
                        <th>Estado</th>
                        {showAcciones && <th>Acciones</th>}
                    </tr>
                </thead>
                <tbody>
                    {paginated.length === 0 ? (
                        <tr>
                            <td colSpan={showAcciones ? 8 : 7} className="text-center text-base-content/60 py-8">
                                No hay exámenes registrados.
                            </td>
                        </tr>
                    ) : (
                        paginated.map((examen) => {
                            const estadoInfo = ESTADOS_EXAMEN[examen.estado] || { label: examen.estado, badge: 'badge-ghost' };
                            return (
                                <tr key={examen.id}>
                                    <td>{examen.id}</td>
                                    <td>{nombreCompleto(examen.alumno)}</td>
                                    <td>{nombreCompleto(examen.instructor)}</td>
                                    <td>
                                        <div className="font-mono text-sm">{examen.vehiculoId || '—'}</div>
                                        {examen.tipoVehiculo && (
                                            <div className="text-xs text-base-content/60 capitalize">{examen.tipoVehiculo}</div>
                                        )}
                                    </td>
                                    <td className="text-sm">{formatFecha(examen.fechaHoraInicio)}</td>
                                    <td className="text-sm">{formatFecha(examen.fechaHoraFin)}</td>
                                    <td>
                                        <span className={`badge ${estadoInfo.badge} badge-sm`}>
                                            {estadoInfo.label}
                                        </span>
                                    </td>
                                    {showAcciones && (
                                        <td>
                                            {esProfesor && examen.estado === 'pendiente' && (
                                                <button
                                                    id={`btn-registrar-${examen.id}`}
                                                    className="btn btn-xs btn-primary"
                                                    onClick={() => onRegistrar && onRegistrar(examen)}
                                                >
                                                    Registrar resultado
                                                </button>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>

            {examenes.length > PAGE_SIZE && (
                <DUPageBrowser
                    currentPageNumber={currentPage}
                    setCurrentPageNumber={setCurrentPage}
                    pageAmount={pageAmount}
                />
            )}
        </div>
    );
};

export default ExamenTable;
