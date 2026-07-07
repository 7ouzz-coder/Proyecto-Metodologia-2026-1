import { useState, useEffect, useMemo } from "react";
import { patchClaseService, deleteClaseService } from "@services/clase.service.js";
import Swal from "sweetalert2";
import { fireDynamicSwal } from "@hooks/utils/dynamicSwal.jsx";
import editClase from "@hooks/Clase/usePatchClase.jsx";

// Hooks y funciones de Clase original para mantener la funcionalidad real
import { useGetClase } from "@hooks/Clase/useGetClase.jsx";
import useCreateClase from "@hooks/Clase/useCreateClase.jsx";
import { useGetTeacherList } from "../hooks/Listas/useGetTeacherList.jsx";
import { useGetVehiculoList } from "../hooks/Listas/useGetVehiculoList.jsx";
import { useGetStudentList } from "../hooks/Listas/useGetStudentList.jsx";
import { getUserRole } from "../services/profile.service.js";
import { ACCESO_CLASES } from "../constants/permissions.constants.admin.jsx";

const GestionClasesAlumnos = () => {
    const [profesores, setProfesores] = useState([]);
    const [vehiculos, setVehiculoList] = useState([]);
    const [alumnos, setAlumnoList] = useState([]);

    const [teacherList, fetchTeacherList] = useGetTeacherList(profesores, setProfesores);
    const [vehiculoList, fetchVehiculoList] = useGetVehiculoList(vehiculos, setVehiculoList);
    const [alumnoList, fetchAlumnoList] = useGetStudentList(alumnos, setAlumnoList);

    const userRole = getUserRole();
    const canCrudClases = ACCESO_CLASES.includes(userRole);

    const [claseData, setClaseData] = useState([]);
    const [Clases, fetchClase] = useGetClase(claseData, setClaseData);

    // Funcionalidad de crear clase conectada al botón "+ Agendar Clase"
    const { handleCreateClase } = useCreateClase(setClaseData, profesores, vehiculoList, alumnoList);
    const { handleEditClase } = editClase(fetchClase);

    const [buscar, setBuscar] = useState("");
    const [filtroTipo, setFiltroTipo] = useState("Todos los tipos");

    useEffect(() => {
        if (typeof fetchClase === "function") fetchClase();
        if (typeof fetchTeacherList === "function") fetchTeacherList();
        if (typeof fetchVehiculoList === "function") fetchVehiculoList();
        if (typeof fetchAlumnoList === "function") fetchAlumnoList();
    }, []);

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar"
        });

        if (result.isConfirmed) {
            try {
                const response = await deleteClaseService(id);
                if (response) {
                    fireDynamicSwal(response.status, null, response.message || "Clase eliminada");
                    fetchClase();
                }
            } catch (error) {
                console.error(error);
                fireDynamicSwal("error", "Error", "No se pudo eliminar la clase");
            }
        }
    };

    const handleEstadoChange = async (id, newEstado) => {
        try {
            const response = await patchClaseService(id, { estado_clase: newEstado });
            if (response) {
                fireDynamicSwal(response.status, null, response.message || "Estado actualizado");
                fetchClase();
            }
        } catch (error) {
            console.error(error);
            fireDynamicSwal("error", "Error", "No se pudo actualizar el estado");
        }
    };

    // Flatten classes per student
    const flattenedList = useMemo(() => {
        const list = [];
        if (Array.isArray(Clases)) {
            Clases.forEach(clase => {
                if (clase.alumnos && clase.alumnos.length > 0) {
                    clase.alumnos.forEach(alumno => {
                        list.push({ ...clase, alumnoObj: alumno });
                    });
                } else {
                    list.push({ ...clase, alumnoObj: { nombre: "Sin asignar", email: "N/A" } });
                }
            });
            list.sort((a, b) => new Date(a.fechaHoraInicio) - new Date(b.fechaHoraInicio));
        }
        return list;
    }, [Clases]);

    const filteredList = flattenedList.filter(item => {
        const matchSearch = buscar === "" || 
            item.alumnoObj?.nombre?.toLowerCase().includes(buscar.toLowerCase()) || 
            item.alumnoObj?.email?.toLowerCase().includes(buscar.toLowerCase()) ||
            item.descripcion?.toLowerCase().includes(buscar.toLowerCase());
        
        const matchType = filtroTipo === "Todos los tipos" || 
            item.tipo?.toLowerCase() === filtroTipo.toLowerCase();
            
        return matchSearch && matchType;
    });

    return (
        <div className="min-h-screen bg-cover bg-center pt-20 pb-12 px-4 sm:px-6 lg:px-8 font-sans relative"
             style={{ backgroundImage: "url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop')" }}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
            
            <div className="max-w-7xl mx-auto relative z-10 space-y-6">
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <h1 className="text-4xl font-bold text-white tracking-wide shadow-black drop-shadow-md">
                        Gestión de Clases Alumnos
                    </h1>
                    {canCrudClases && (
                        <button 
                            className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-lg font-semibold transition-colors flex items-center gap-2"
                            onClick={() => handleCreateClase(profesores, setProfesores)}
                        >
                            + Agendar Clase
                        </button>
                    )}
                </div>

                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <input 
                        type="text" 
                        placeholder="Buscar alumno por nombre o email..." 
                        className="bg-gray-900/80 text-white placeholder-gray-400 border border-gray-700 px-4 py-3 rounded-lg w-full md:w-1/2 outline-none focus:border-indigo-500 transition-colors"
                        value={buscar}
                        onChange={(e) => setBuscar(e.target.value)}
                    />
                    <select 
                        className="bg-gray-900/80 text-white border border-gray-700 px-4 py-3 rounded-lg w-full md:w-1/4 outline-none focus:border-indigo-500"
                        value={filtroTipo}
                        onChange={(e) => setFiltroTipo(e.target.value)}
                    >
                        <option value="Todos los tipos">Todos los tipos</option>
                        <option value="Práctica">Práctica</option>
                        <option value="Teórica">Teórica</option>
                    </select>
                </div>

                <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-700">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Alumno</th>
                                    <th className="px-6 py-4 font-semibold">Fecha</th>
                                    <th className="px-6 py-4 font-semibold">Tipo</th>
                                    <th className="px-6 py-4 font-semibold">Vehículo</th>
                                    <th className="px-6 py-4 font-semibold">Estado Actual</th>
                                    <th className="px-6 py-4 font-semibold">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredList.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                            No se encontraron clases.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredList.map((item, index) => {
                                        const d = new Date(item.fechaHoraInicio);
                                        const dFin = new Date(item.fechaHoraFin);
                                        const fechaStr = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
                                        const estado = item.estado_clase || "Pendiente";
                                        
                                        // Badge color based on state
                                        const isActiva = estado.toLowerCase() === "activa" || estado.toLowerCase() === "activo";
                                        const isCompletada = estado.toLowerCase() === "completada";
                                        const isCancelada = estado.toLowerCase() === "cancelada" || estado.toLowerCase() === "cancelado";
                                        
                                        const badgeClass = isCompletada 
                                            ? "bg-green-100 text-green-700 border-green-200" 
                                            : isActiva 
                                            ? "bg-blue-100 text-blue-700 border-blue-200" 
                                            : isCancelada
                                            ? "bg-red-100 text-red-700 border-red-200"
                                            : "bg-gray-100 text-gray-700 border-gray-200";

                                        return (
                                            <tr key={`${item.id}-${index}`} className="border-b hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-gray-900">{item.alumnoObj?.nombre}</div>
                                                    <div className="text-xs text-gray-500">{item.alumnoObj?.email}</div>
                                                </td>
                                                <td className="px-6 py-4 font-medium">{fechaStr}</td>
                                                <td className="px-6 py-4 font-bold text-gray-800">{item.tipo?.toUpperCase()}</td>
                                                <td className="px-6 py-4 text-gray-600">{item.vehiculoId || "-"}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${badgeClass}`}>
                                                        {estado}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-2 w-36">
                                                        <select 
                                                            className="bg-gray-900 text-white text-xs px-3 py-2 rounded shadow-sm outline-none cursor-pointer"
                                                            value={estado}
                                                            onChange={(e) => handleEstadoChange(item.id, e.target.value)}
                                                            disabled={!canCrudClases}
                                                        >
                                                            <option value="Pendiente">Pendiente</option>
                                                            <option value="Activa">Activa</option>
                                                            <option value="Completada">Completada</option>
                                                            <option value="Cancelada">Cancelada</option>
                                                        </select>
                                                        {canCrudClases && (
                                                            <div className="flex gap-2">
                                                                <button 
                                                                    className="flex-1 border border-blue-400 text-blue-500 hover:bg-blue-50 text-xs px-2 py-1 rounded transition-colors"
                                                                    onClick={() => {
                                                                        const claseToEdit = {
                                                                            ...item,
                                                                            id_clase: item.id,
                                                                            fecha_clase: d.toISOString().split('T')[0],
                                                                            hora_inicio: d.toTimeString().substring(0,5),
                                                                            hora_fin: dFin.toTimeString().substring(0,5),
                                                                            dia: "Lunes"
                                                                        };
                                                                        handleEditClase(item.id, claseToEdit);
                                                                    }}
                                                                >
                                                                    Editar
                                                                </button>
                                                                <button 
                                                                    className="flex-1 border border-red-400 text-red-500 hover:bg-red-50 text-xs px-2 py-1 rounded transition-colors"
                                                                    onClick={() => handleDelete(item.id)}
                                                                >
                                                                    Eliminar
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GestionClasesAlumnos;
