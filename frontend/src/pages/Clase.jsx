// import "@styles/Clase.css";
import { useGetClase } from "@hooks/Clase/useGetClase.jsx";
import useCreateClase from "@hooks/Clase/useCreateClase.jsx";
import editClase from "@hooks/Clase/usePatchClase.jsx"; 
import DeleteClase from "@hooks/Clase/useDeleteClase.jsx";
import { useEffect, useState } from "react";
import { useClasesConUsuarios } from "@hooks/Clase/useGetUsersClase.jsx";
import { useAsignarPorLote } from "@hooks/Clase/useAssignClase.jsx";
import { useEditAsignacion } from "@hooks/Clase/useEditAssignClase.jsx";
import { useGetTeacherList } from "../hooks/Listas/useGetTeacherList.jsx";
import { useGetVehiculoList } from "../hooks/Listas/useGetVehiculoList.jsx";

import { DUClaseTable } from "../components/daisyui/table/DUClase.jsx";
import { getUserRole } from "../services/profile.service.js";
import { DUPageBrowser } from "../components/daisyui/DUPageBrowser.jsx";
import { ACCESO_CLASES } from "../constants/permissions.constants.admin.jsx";

const Clase = () => {
    const [profesores, setProfesores] = useState([]);
    const [vehiculos, setVehiculoList] = useState([]);

    const [teacherList, fetchTeacherList] = useGetTeacherList(profesores, setProfesores);
    const [vehiculoList, fetchVehiculoList] = useGetVehiculoList(vehiculos, setVehiculoList);

    const userRole = getUserRole();
    //console.log(`EL ROL DEL USIARIO = ${userRole}`);
    const canCrudClases = ACCESO_CLASES.includes(userRole);

    const [claseData, setClaseData] = useState([]);

    const [Clases, fetchClase] = useGetClase(claseData, setClaseData);

    const { handleCreateClase } = useCreateClase(setClaseData, profesores, vehiculoList);
    const { handleEditClase } = editClase(fetchClase);
    const { handleDeleteClase } = DeleteClase(fetchClase);

    const { loading: loadingUsuarios, fetchClasesConUsuarios} = useClasesConUsuarios();
    const { loading: loadingLote, asignarPorLote} =useAsignarPorLote();
    const {loading: loadingEditarAsignacion, editarAsignacion} = useEditAsignacion();
    const [buscar, setBuscar] = useState("");

    useEffect(() => {
        if (typeof(fetchClase) === 'function') {
            fetchClase();
        }
        if (typeof(fetchTeacherList) === 'function') {
            fetchTeacherList();
        }
         /*console.log("teacherList:", teacherList);
        console.log("claseData[0]:", claseData[0]);*/
        if (typeof(fetchVehiculoList) === 'function') {
            fetchVehiculoList();
        }
    }, []);

    const limpiarFiltros = () => {
        setBuscar("");
    };

    //paginacion
    const POSTS_PER_PAGE = 4;
    const [currentPage, setCurrentPage] = useState(1);

    const lastPostIndex  = currentPage * POSTS_PER_PAGE;
    const firstPostIndex = lastPostIndex - POSTS_PER_PAGE;
    const currentPageContent = (Array.isArray(Clases) && Clases.slice(firstPostIndex, lastPostIndex)) || [];
    const pageAmount = Math.abs(Math.ceil((Array.isArray(Clases) && Clases?.length) / POSTS_PER_PAGE)) || 0;

    return (
        <div className="Clase-page">
            <div>
                {canCrudClases && (<button className="btn btn-primary" onClick={() => handleCreateClase(profesores, setProfesores)}>Crear Clase</button>)}
                {canCrudClases && (
                    <button
                        className="btn btn-secondary"
                        onClick={asignarPorLote}
                        disabled={loadingLote}
                    >
                        {loadingLote ? 'Asignando...' : 'Asignar por lote'}
                    </button>
                )}
                {(
                    <button
                        className="btn btn-accent"
                        onClick={fetchClasesConUsuarios}
                        disabled={loadingUsuarios}
                    >
                        {loadingUsuarios ? 'Cargando...' : 'Ver usuarios asignados'}
                    </button>
                )}
                {(buscar ) && (
                    <button className="solicitud-limpiar-btn btn ml-5" onClick={limpiarFiltros}>
                        Limpiar
                    </button>
                )}
            </div>
            <div className="Clase2-page">
                <DUClaseTable data={currentPageContent || []}  handleEditClase={handleEditClase} handleDeleteClase={handleDeleteClase} handleEditarAsignacion={editarAsignacion} loadingEditarAsignacion={loadingEditarAsignacion} canCrudClases={canCrudClases} teacherList={teacherList}/>
            </div>
            <DUPageBrowser setCurrentPageNumber={setCurrentPage} currentPageNumber={currentPage} pageAmount={pageAmount}></DUPageBrowser>
        </div>
    );
};

export default Clase;