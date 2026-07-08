import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@context/AuthContext';
import { useGetExamenes } from '../hooks/ExamenPractico/useGetExamenes.jsx';
import { getHistorialAlumno } from '../services/examen.service.js';
import { ExamenTable } from '../components/ExamenPractico/ExamenTable.jsx';
import { ProgramarExamenForm } from '../components/ExamenPractico/ProgramarExamenForm.jsx';
import { RegistrarResultadoForm } from '../components/ExamenPractico/RegistrarResultadoForm.jsx';


const ExamenPractico = () => {
    const { user } = useAuth();
    const rol = (user?.rol || '').toLowerCase();
    const [examenes, setExamenes] = useState([]);
    const [historial, setHistorial] = useState([]);
    const [loadingHistorial, setLoadingHistorial] = useState(false);
    const [modalProgramar, setModalProgramar] = useState(false);
    const [modalResultado, setModalResultado] = useState(false);
    const [examenSeleccionado, setExamenSeleccionado] = useState(null);
    const [, fetchExamenes] = useGetExamenes(examenes, setExamenes);
    const cargarDatos = useCallback(async () => {
        if (rol === 'estudiante') {
            if (!user?.id) return;
            setLoadingHistorial(true);
            try {
                const resp = await getHistorialAlumno(user.id);
                setHistorial(resp?.data ?? resp ?? []);
            } catch {
                setHistorial([]);
            } finally {
                setLoadingHistorial(false);
            }
        } else {
            await fetchExamenes();
        }
    }, [rol, user?.id]);
    useEffect(() => { cargarDatos(); }, [cargarDatos]);

    const abrirRegistrar = (examen) => {
        setExamenSeleccionado(examen);
        setModalResultado(true);
    };

    const contenido = (
        <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                    <h1 className="text-2xl font-bold">Exámenes Prácticos</h1>
                    <p className="text-sm text-base-content/60">
                        {rol === 'estudiante'
                            ? 'Tu historial académico de exámenes prácticos'
                            : 'Gestión de exámenes prácticos de conducción'}
                    </p>
                </div>

                {/* Botón sólo para secretario */}
                {rol === 'secretario' && (
                    <button
                        id="btn-programar-examen"
                        className="btn btn-primary"
                        onClick={() => setModalProgramar(true)}
                    >
                        + Programar examen
                    </button>
                )}
            </div>

            {/* Tabla */}
            {rol === 'estudiante' ? (
                loadingHistorial ? (
                    <div className="flex justify-center py-12">
                        <span className="loading loading-spinner loading-lg" />
                    </div>
                ) : (
                    <ExamenTable
                        examenes={historial}
                        showAcciones={false}
                    />
                )
            ) : (
                <ExamenTable
                    examenes={examenes}
                    showAcciones={rol === 'profesor'}
                    esProfesor={rol === 'profesor'}
                    onRegistrar={abrirRegistrar}
                />
            )}

            <ProgramarExamenForm
                isOpen={modalProgramar}
                onClose={() => setModalProgramar(false)}
                onSuccess={cargarDatos}
            />

            <RegistrarResultadoForm
                examen={examenSeleccionado}
                isOpen={modalResultado}
                onClose={() => { setModalResultado(false); setExamenSeleccionado(null); }}
                onSuccess={cargarDatos}
            />
        </div>
    );

    return contenido;
};

export default ExamenPractico;
