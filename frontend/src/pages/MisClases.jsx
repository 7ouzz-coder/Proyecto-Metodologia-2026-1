import { useEffect, useState } from "react";
import { getClasesService, deleteClaseService } from "@services/clase.service.js";
import { getUserRole } from "@services/profile.service.js";
import { DUPageBrowser } from "@components/daisyui/DUPageBrowser.jsx";
import { alertSuccess, alertError, confirmDelete } from "@helpers/sweetAlert.js";

const MisClases = () => {
    const userRole = getUserRole();
    const isTeacher = userRole === "profesor";

    const [clasesData, setClasesData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [buscar, setBuscar] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchClases();
    }, []);

    const fetchClases = async () => {
        try {
            setIsLoading(true);
            const data = await getClasesService();
            setClasesData(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error al obtener clases:", error);
            alertError("Error al obtener las clases");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteClase = async (id_clase) => {
        try {
            const isConfirmed = await confirmDelete(
                "¿Está seguro que desea cancelar esta clase?"
            );
            if (!isConfirmed) return;

            setIsLoading(true);
            const response = await deleteClaseService(id_clase);
            if (response.status === 200) {
                alertSuccess("Clase cancelada exitosamente");
                fetchClases();
            }
        } catch (error) {
            alertError("Error al cancelar la clase");
        } finally {
            setIsLoading(false);
        }
    };

    // Filtrado de clases
    const filteredClases = Array.isArray(clasesData)
        ? clasesData.filter(
            (clase) =>
                clase.descripcion?.toLowerCase().includes(buscar.toLowerCase()) ||
                clase.tipo?.toLowerCase().includes(buscar.toLowerCase()) ||
                clase.dia?.toLowerCase().includes(buscar.toLowerCase())
        )
        : [];

    // Paginación
    const POSTS_PER_PAGE = 5;
    const lastPostIndex = currentPage * POSTS_PER_PAGE;
    const firstPostIndex = lastPostIndex - POSTS_PER_PAGE;
    const currentPageContent = filteredClases.slice(firstPostIndex, lastPostIndex);
    const pageAmount = Math.ceil(filteredClases.length / POSTS_PER_PAGE) || 0;

    const limpiarFiltros = () => {
        setBuscar("");
        setCurrentPage(1);
    };

    const getDayOfWeekEmoji = (dia) => {
        const daysMap = {
            lunes: "🅼",
            martes: "🅼",
            miercoles: "🅼",
            jueves: "🅽",
            viernes: "🅽",
            sabado: "🅾",
            domingo: "🅾",
        };
        return daysMap[dia?.toLowerCase()] || "📅";
    };

    if (!isTeacher) {
        return (
            <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center font-sans">
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl shadow-sm max-w-md text-center">
                    <span className="block text-2xl mb-2">🔒</span>
                    <span className="font-semibold">Acceso denegado.</span> Solo los profesores pueden acceder a esta página.
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Cabecera */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-slate-200/50 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-white">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Mis Clases</h1>
                        <p className="text-slate-500 mt-2 font-medium">Gestiona y revisa tu calendario de clases asignadas</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-72">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                🔍
                            </span>
                            <input
                                type="text"
                                placeholder="Buscar clases..."
                                className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-100 rounded-xl text-slate-800 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 focus:outline-none transition-all duration-200"
                                value={buscar}
                                onChange={(e) => {
                                    setBuscar(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                        {buscar && (
                            <button 
                                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-semibold transition-colors"
                                onClick={limpiarFiltros}
                            >
                                Limpiar
                            </button>
                        )}
                        {isLoading && <span className="loading loading-spinner text-emerald-500"></span>}
                    </div>
                </div>

                {/* Grid de Clases */}
                {currentPageContent.length === 0 ? (
                    <div className="bg-blue-50 border border-blue-100 text-blue-800 p-8 rounded-3xl text-center shadow-sm">
                        <span className="block text-4xl mb-3">📅</span>
                        <p className="text-lg font-medium">No hay clases registradas para mostrar.</p>
                    </div>
                ) : (
                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {currentPageContent.map((clase) => (
                            <div key={clase.id_clase} className="bg-white rounded-3xl shadow-lg shadow-slate-200/40 border border-slate-100 p-6 flex flex-col transition-transform hover:-translate-y-1 duration-300">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                        {clase.tipo}
                                    </div>
                                    <div className="text-slate-400">
                                        {getDayOfWeekEmoji(clase.dia)}
                                    </div>
                                </div>
                                
                                <h3 className="text-xl font-bold text-slate-800 mb-2 capitalize">
                                    {clase.dia}
                                </h3>
                                
                                <p className="text-slate-600 mb-6 flex-1 line-clamp-3 leading-relaxed">
                                    {clase.descripcion}
                                </p>
                                
                                <div className="space-y-3 pt-4 border-t border-slate-100">
                                    <div className="flex items-center text-slate-500 text-sm font-medium">
                                        <span className="mr-2">📅</span> {clase.fecha_clase}
                                    </div>
                                    <div className="flex items-center text-slate-500 text-sm font-medium">
                                        <span className="mr-2">🕐</span> {clase.hora_inicio} - {clase.hora_fin}
                                    </div>
                                </div>

                                <button
                                    className="mt-6 w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl transition-colors flex items-center justify-center disabled:opacity-50"
                                    onClick={() => handleDeleteClase(clase.id_clase)}
                                    disabled={isLoading}
                                >
                                    Cancelar Clase
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Paginación */}
                {pageAmount > 1 && (
                    <div className="flex justify-center mt-8 bg-white/50 backdrop-blur-sm py-4 rounded-3xl shadow-sm border border-slate-100 inline-block px-8 mx-auto w-fit">
                        <DUPageBrowser
                            setCurrentPageNumber={setCurrentPage}
                            currentPageNumber={currentPage}
                            pageAmount={pageAmount}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default MisClases;
