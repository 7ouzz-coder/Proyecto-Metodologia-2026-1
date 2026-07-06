import { useEffect, useState, useRef } from "react";
import { useGetEvaluacion } from "@hooks/Evaluacion/useGetEvaluacion.jsx";
import useCreateEvaluacion from "@hooks/Evaluacion/useCreateEvaluacion.jsx";
import useUpdateEvaluacion from "@hooks/Evaluacion/useUpdateEvaluacion.jsx";
import useDeleteEvaluacion from "@hooks/Evaluacion/useDeleteEvaluacion.jsx";
import { EvaluacionForm } from "@components/Evaluacion/EvaluacionForm.jsx";
import { EvaluacionTable } from "@components/Evaluacion/EvaluacionTable.jsx";
import { DUPageBrowser } from "@components/daisyui/DUPageBrowser.jsx";
import { getUserRole } from "@services/profile.service.js";

const Evaluacion = () => {
    const userRole = getUserRole();
    const isTeacher = userRole === "profesor";

    const [evaluacionData, setEvaluacionData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [buscar, setBuscar] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedEvaluacion, setSelectedEvaluacion] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const modalRef = useRef(null);

    const [Evaluaciones, fetchEvaluacion] = useGetEvaluacion(evaluacionData, setEvaluacionData);
    const { handleCreateEvaluacion } = useCreateEvaluacion(fetchEvaluacion);
    const { handleUpdateEvaluacion } = useUpdateEvaluacion(fetchEvaluacion);
    const { handleDeleteEvaluacion } = useDeleteEvaluacion(fetchEvaluacion);

    useEffect(() => {
        if (typeof fetchEvaluacion === "function") {
            fetchEvaluacion();
        }
    }, []);

    // Filtrado de evaluaciones
    const filteredEvaluaciones = Array.isArray(Evaluaciones)
        ? Evaluaciones.filter((e) =>
            e.alumno.toLowerCase().includes(buscar.toLowerCase())
        )
        : [];

    // Paginación
    const POSTS_PER_PAGE = 5;
    const lastPostIndex = currentPage * POSTS_PER_PAGE;
    const firstPostIndex = lastPostIndex - POSTS_PER_PAGE;
    const currentPageContent = filteredEvaluaciones.slice(firstPostIndex, lastPostIndex);
    const pageAmount = Math.ceil(filteredEvaluaciones.length / POSTS_PER_PAGE) || 0;

    const limpiarFiltros = () => {
        setBuscar("");
        setCurrentPage(1);
    };

    const handleOpenForm = (evaluacion = null) => {
        setSelectedEvaluacion(evaluacion);
        setIsFormOpen(true);
        modalRef.current?.showModal();
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setSelectedEvaluacion(null);
        modalRef.current?.close();
    };

    const handleFormSubmit = async (formData) => {
        setIsLoading(true);
        try {
            if (selectedEvaluacion) {
                // Actualizar evaluación
                const result = await handleUpdateEvaluacion(
                    selectedEvaluacion.id_evaluacion,
                    formData
                );
                if (result.success) {
                    handleCloseForm();
                }
            } else {
                // Crear evaluación
                const result = await handleCreateEvaluacion(formData);
                if (result.success) {
                    handleCloseForm();
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteClick = async (id_evaluacion) => {
        setIsLoading(true);
        try {
            await handleDeleteEvaluacion(id_evaluacion);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isTeacher) {
        return (
            <div className="alert alert-warning m-4">
                <span>Acceso denegado. Solo los profesores pueden acceder a esta página.</span>
            </div>
        );
    }

    return (
        <div className="evaluacion-page p-4">
            <div className="mb-4">
                <h1 className="text-3xl font-bold mb-4">Gestión de Evaluaciones</h1>

                <div className="flex gap-2 mb-4 flex-wrap">
                    {/* Botón crear evaluación */}
                    <button
                        className="btn btn-primary"
                        onClick={() => handleOpenForm()}
                        disabled={isLoading}
                    >
                        + Nueva Evaluación
                    </button>

                    {/* Buscador */}
                    <input
                        type="text"
                        placeholder="Buscar por nombre del alumno..."
                        className="input input-bordered flex-1 max-w-xs"
                        value={buscar}
                        onChange={(e) => {
                            setBuscar(e.target.value);
                            setCurrentPage(1);
                        }}
                    />

                    {/* Limpiar filtros */}
                    {buscar && (
                        <button className="btn btn-outline" onClick={limpiarFiltros}>
                            Limpiar Filtros
                        </button>
                    )}
                </div>
            </div>

            {/* Tabla de evaluaciones */}
            <div className="mb-4">
                <EvaluacionTable
                    data={currentPageContent}
                    onEdit={handleOpenForm}
                    onDelete={handleDeleteClick}
                    isLoading={isLoading}
                />
            </div>

            {/* Paginación */}
            <DUPageBrowser
                setCurrentPageNumber={setCurrentPage}
                currentPageNumber={currentPage}
                pageAmount={pageAmount}
            />

            {/* Modal del formulario */}
            <dialog ref={modalRef} className="modal">
                <EvaluacionForm
                    evaluacion={selectedEvaluacion}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCloseForm}
                    isLoading={isLoading}
                />
                <form method="dialog" className="modal-backdrop">
                    <button onClick={handleCloseForm} />
                </form>
            </dialog>
        </div>
    );
};

export default Evaluacion;
