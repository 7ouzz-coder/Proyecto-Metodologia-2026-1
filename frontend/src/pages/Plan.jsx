import { useEffect, useState } from "react";
import { useGetPlanes } from "../hooks/Planes/useGetPlanes.jsx";
import useCreatePlan from "../hooks/Planes/useCreatePlan.jsx";
import useEditPlan from "../hooks/Planes/useEditPlan.jsx";
import useDeletePlan from "../hooks/Planes/useDeletePlan.jsx";

const Plan = () => {
    const [planesData, setPlanesData] = useState([]);

    const [planes, fetchPlanes] = useGetPlanes(planesData, setPlanesData);

    const { handleCreatePlan } = useCreatePlan(fetchPlanes);
    const { handleEditPlan } = useEditPlan(fetchPlanes);
    const { handleDeletePlan } = useDeletePlan(fetchPlanes);
    const [buscar, setBuscar] = useState("");

    useEffect(() => {
        if (typeof fetchPlanes === 'function') {
            fetchPlanes();
        }
    }, []);

    const limpiarFiltros = () => {
        setBuscar("");
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Cabecera */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-slate-200/50 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-white">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Gestión de Planes</h1>
                        <p className="text-slate-500 mt-2 font-medium">Administra los planes de conducción ofrecidos</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <button 
                            className="w-full md:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/30 transition-all hover:-translate-y-0.5"
                            onClick={() => handleCreatePlan(fetchPlanes)}
                        >
                            + Crear Plan
                        </button>
                        
                        {buscar && (
                            <button className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-semibold transition-colors" onClick={limpiarFiltros}>
                                Limpiar Filtros
                            </button>
                        )}
                    </div>
                </div>
                
                {/* Contenido / Tabla */}
                <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/40 border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50 border-b border-slate-100 text-slate-700 uppercase tracking-wider text-xs font-bold">
                                <tr>
                                    <th className="px-6 py-4">ID</th>
                                    <th className="px-6 py-4">Nombre</th>
                                    <th className="px-6 py-4">Precio</th>
                                    <th className="px-6 py-4">Duración</th>
                                    <th className="px-6 py-4">Clases</th>
                                    <th className="px-6 py-4">Tipo</th>
                                    <th className="px-6 py-4">Estado</th>
                                    <th className="px-6 py-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {planes?.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-slate-400">
                                                <span className="text-4xl mb-3">📋</span>
                                                <p className="text-lg font-medium text-slate-500">No hay planes registrados</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    planes?.map((plan) => (
                                        <tr key={plan.id_plan} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 font-mono font-medium text-slate-400">{plan.id_plan}</td>
                                            <td className="px-6 py-4 font-bold text-slate-800">{plan.nombre}</td>
                                            <td className="px-6 py-4 font-bold text-emerald-600">${plan.costo}</td>
                                            <td className="px-6 py-4 font-medium">{plan.duracion_semanas} sem</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                                                    {plan.clases_totales}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                                                    ${plan.tipo === 'teorico' ? 'bg-blue-100 text-blue-800' :
                                                      plan.tipo === 'practico' ? 'bg-amber-100 text-amber-800' :
                                                      'bg-emerald-100 text-emerald-800'
                                                    }`}>
                                                    {plan.tipo}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                                                    ${plan.estado === 'activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${plan.estado === 'activo' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                    <span>{plan.estado}</span>
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button
                                                    className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors"
                                                    onClick={() => handleEditPlan(plan)}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors"
                                                    onClick={() => handleDeletePlan(plan.id_plan, plan.nombre)}
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Plan;