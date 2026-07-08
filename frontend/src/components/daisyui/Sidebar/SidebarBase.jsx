import { SidebarItem } from "./SidebarItem.jsx";
import { 
  MdHouse, 
  MdSchool, 
  MdAttachMoney, 
  MdShoppingCart, 
  MdAdminPanelSettings,
  MdDirectionsCar,
  MdLogout
} from "react-icons/md";

import { useAuth } from '@context/AuthContext';
import { logout } from '@services/auth.service.js';
import { useNavigate } from 'react-router-dom';

export const SidebarBase = ({pageContent}) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        // Recargar la página para que el contexto de autenticación se limpie correctamente o redirigir
        window.location.href = '/auth';
    };
    return (
    <div className="drawer lg:drawer-open">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
            {/* Navbar */}
            <nav className="navbar w-full bg-base-300">
            <label htmlFor="my-drawer-4" aria-label="open sidebar" className="btn btn-square btn-ghost">
                {/* Sidebar toggle icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4"><path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path><path d="M9 4v16"></path><path d="M14 10l2 2l-2 2"></path></svg>
            </label>
            <div className="px-4">Opciones</div>
            </nav>
            <div className="actual-page-background">
                <div className="p-4 actual-page-content">
                    {pageContent}
                </div>
            </div>
        </div>

        <div className="drawer-side is-drawer-close:overflow-visible">
            <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
            <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
            {/* Sidebar content here */}
            <ul className="menu w-full grow">
                <SidebarItem label="Inicio" destination="/home" icon={MdHouse} />            
                <SidebarItem label="Gestión de Clases" destination="/gestion-clases-alumnos" icon={MdSchool} />
                {user?.rol === 'profesor' && (
                    <>
                        <SidebarItem label="Mis Clases" destination="/mis-clases" icon={MdSchool} />
                        <SidebarItem label="Generar QR Asistencia" destination="/generar-qr-clase" icon={MdSchool} />
                        <SidebarItem label="Ver Asistencias" destination="/ver-asistencia" icon={MdSchool} />
                        <SidebarItem label="Exámenes Prácticos" destination="/examenes-practicos" icon={MdDirectionsCar} />
                    </>
                )}
                {user?.rol === 'estudiante' && (
                    <>
                        <SidebarItem label="Mi Historial de Clases" destination="/historial-clases" icon={MdSchool} />
                        <SidebarItem label="Registrar Asistencia (QR)" destination="/escanear-asistencia" icon={MdSchool} />
                        <SidebarItem label="Mi Historial Exámenes" destination="/examenes-practicos" icon={MdDirectionsCar} />
                    </>
                )}
                {user?.rol === 'secretario' && (
                    <>
<<<<<<< HEAD
                        <SidebarItem label="Exámenes Prácticos" destination="/examenes-practicos" icon={MdDirectionsCar} />
                        <SidebarItem label="Gestionar Preinscripciones" destination="/gestionar-ventas" icon={MdAttachMoney} />
=======
                        <SidebarItem label="Gestionar Preinscripciones" destination="/gestionar-ventas" icon={MdAttachMoney} />
                        <SidebarItem label="Gestión de Vehículos" destination="/gestion-vehiculos" icon={MdDirectionsCar} />
>>>>>>> main
                    </>
                )}
                {/* <SidebarItem label="Deudas" destination="/class" icon={MdAttachMoney} />*/}
            </ul>
            <div className="w-full p-4 mt-auto">
                <button 
                    onClick={handleLogout} 
                    className="btn btn-error btn-outline w-full flex items-center justify-center gap-2"
                >
                    <MdLogout className="text-xl" />
                    <span>Cerrar Sesión</span>
                </button>
            </div>
            </div>
        </div>
    </div>
    );
}

export default SidebarBase;