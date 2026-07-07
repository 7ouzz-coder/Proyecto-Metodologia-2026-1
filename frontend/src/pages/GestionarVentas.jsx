import { useEffect, useState } from 'react';
import { useAuth } from '@context/AuthContext';
import { useVentas } from '../hooks/useVentas';

export default function GestionarVentas() {
  const { user } = useAuth();
  const { getAllVentas, getHistorialPreRegistros, aprobarVenta, rechazarVenta, loading } = useVentas();
  
  const [solicitudes, setSolicitudes] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [mensaje, setMensaje] = useState(null);
  
  // UI State
  const [activeTab, setActiveTab] = useState('pendientes'); // 'pendientes' | 'historial'
  const [modalRechazo, setModalRechazo] = useState({ isOpen: false, id: null, motivo: '' });

  useEffect(() => {
    if (user?.rol === 'secretario') {
      cargarSolicitudes();
      if (activeTab === 'historial') {
        cargarHistorial();
      }
    }
  }, [user, activeTab]);

  const cargarSolicitudes = async () => {
    try {
      const response = await getAllVentas();
      setSolicitudes(response || []);
    } catch (err) {
      console.error("Error al cargar solicitudes", err);
    }
  };

  const cargarHistorial = async () => {
    try {
      const response = await getHistorialPreRegistros();
      setHistorial(response || []);
    } catch (err) {
      console.error("Error al cargar historial", err);
    }
  };

  // Se borró cargarSolicitudes() repetido ya que lo pusimos arriba

  const handleAprobar = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas aprobar esta preinscripción? Se creará una cuenta de alumno en el sistema.")) return;
    
    setMensaje(null);
    try {
      await aprobarVenta(id);
      setMensaje({ type: 'success', text: 'Preinscripción aprobada. Se creó el usuario alumno y se envió correo con credenciales.' });
      cargarSolicitudes();
    } catch (err) {
      setMensaje({ type: 'error', text: err.message || 'Error al aprobar la solicitud.' });
    }
  };

  const abrirModalRechazo = (id) => {
    setModalRechazo({ isOpen: true, id, motivo: '' });
  };

  const confirmarRechazo = async () => {
    if (!modalRechazo.motivo.trim()) {
      alert("Debes escribir un motivo para el rechazo.");
      return;
    }
    
    setMensaje(null);
    try {
      await rechazarVenta(modalRechazo.id, modalRechazo.motivo);
      setMensaje({ type: 'success', text: 'Preinscripción rechazada correctamente. Se envió correo notificando al postulante.' });
      setModalRechazo({ isOpen: false, id: null, motivo: '' });
      cargarSolicitudes();
    } catch (err) {
      setMensaje({ type: 'error', text: err.message || 'Error al rechazar la solicitud.' });
    }
  };

  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return '?';
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    return edad;
  };

  if (user?.rol !== 'secretario') {
    return (
      <div className="flex justify-center mt-10">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          No tienes permisos para ver esta página. Acceso restringido a secretarios.
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
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Gestión de Preinscripciones</h1>
                <p className="text-slate-500 mt-2 font-medium">Panel de secretaría para validación administrativa</p>
            </div>
            <div className="flex items-center gap-3 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl border border-emerald-200">
                <span className="font-bold">Total pendientes:</span>
                <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-lg text-sm font-bold">{solicitudes.length}</span>
            </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/60 mb-6 w-full md:w-auto">
            <button
                className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${
                    activeTab === 'pendientes' 
                    ? 'bg-white text-emerald-700 shadow-sm border border-slate-100' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-white/40'
                }`}
                onClick={() => setActiveTab('pendientes')}
            >
                Pendientes
            </button>
            <button
                className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${
                    activeTab === 'historial' 
                    ? 'bg-white text-emerald-700 shadow-sm border border-slate-100' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-white/40'
                }`}
                onClick={() => setActiveTab('historial')}
            >
                Historial
            </button>
        </div>

        {mensaje && (
          <div className={`p-4 rounded-xl flex items-center space-x-3 shadow-sm border ${mensaje.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'} mb-6`}>
            <span className="text-xl">{mensaje.type === 'error' ? '⚠️' : '✅'}</span>
            <span className="font-medium">{mensaje.text}</span>
          </div>
        )}

        {/* Tabla */}
        <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/40 border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800">
                {activeTab === 'pendientes' ? 'Solicitudes Pendientes' : 'Historial de Resoluciones'}
              </h2>
              {loading && <span className="text-emerald-500 text-sm font-semibold flex items-center gap-2"><span className="animate-spin inline-block w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full"></span> Cargando...</span>}
          </div>
          
          {loading && (activeTab === 'pendientes' ? solicitudes.length : historial.length) === 0 ? (
            <div className="p-12 text-center text-slate-400">
                <span className="animate-spin inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mb-4"></span>
                <p className="font-medium">Cargando preinscripciones...</p>
            </div>
          ) : (activeTab === 'pendientes' ? solicitudes.length : historial.length) === 0 ? (
            <div className="p-12 text-center text-slate-400">
                <span className="text-5xl block mb-4">{activeTab === 'pendientes' ? '📫' : '📂'}</span>
                <p className="text-lg font-medium text-slate-500">
                    {activeTab === 'pendientes' ? 'No hay preinscripciones pendientes.' : 'El historial está vacío.'}
                </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-700 uppercase tracking-wider text-xs font-bold">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Solicitante</th>
                    <th className="px-6 py-4">Contacto</th>
                    <th className="px-6 py-4">Plan & Sede</th>
                    <th className="px-6 py-4 text-center">Comprobante</th>
                    <th className="px-6 py-4 text-center">Estado</th>
                    <th className="px-6 py-4 text-right">{activeTab === 'pendientes' ? 'Acciones' : 'Detalles'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(activeTab === 'pendientes' ? solicitudes : historial).map((sol) => (
                    <tr key={sol.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono font-medium text-slate-400">#{sol.id}</td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800">{sol.nombreCompleto} <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full ml-1">{calcularEdad(sol.fechaNacimiento)} años</span></p>
                        <p className="text-xs text-slate-500 mt-1 font-mono">RUT: {sol.rut}</p>
                      </td>
                      <td className="px-6 py-4">
                          <p className="font-medium text-slate-600 text-sm">📞 {sol.telefono}</p>
                          <p className="text-xs text-slate-500 mt-1 truncate max-w-[150px]" title={sol.email}>📧 {sol.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 mb-1">
                          {sol.plan}
                        </span>
                        <p className="text-xs text-slate-500 flex items-center"><span className="mr-1">📍</span> {sol.sede}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {sol.comprobantePagoUrl && sol.comprobantePagoUrl !== 'archivo-adjunto' ? (
                          <a 
                            href={sol.comprobantePagoUrl.startsWith('http') ? sol.comprobantePagoUrl : `http://localhost:5000/uploads/comprobantes/${sol.comprobantePagoUrl}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
                          >
                            <span>📄 Ver</span>
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400 italic">No disponible</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold
                            ${sol.estado === 'pendiente' ? 'bg-amber-100 text-amber-800' :
                              sol.estado === 'aceptado' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'}`}>
                          {sol.estado.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        {activeTab === 'pendientes' ? (
                            <div className="space-x-2">
                                <button
                                onClick={() => handleAprobar(sol.id)}
                                disabled={loading}
                                className="inline-flex items-center px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-sm font-bold transition-colors shadow-sm disabled:opacity-50"
                                >
                                Aprobar
                                </button>
                                <button
                                onClick={() => abrirModalRechazo(sol.id)}
                                disabled={loading}
                                className="inline-flex items-center px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-sm font-bold transition-colors shadow-sm disabled:opacity-50"
                                >
                                Rechazar
                                </button>
                            </div>
                        ) : (
                            <div className="text-left text-xs max-w-[200px] overflow-hidden">
                                {sol.estado === 'rechazado' && sol.motivoRechazo && (
                                    <div>
                                        <span className="font-bold text-slate-700 block">Motivo:</span>
                                        <p className="text-slate-500 truncate" title={sol.motivoRechazo}>{sol.motivoRechazo}</p>
                                    </div>
                                )}
                            </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Rechazo */}
      {modalRechazo.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
                <div className="p-6 border-b border-slate-100 bg-red-50/50">
                    <h3 className="text-xl font-bold text-red-800 flex items-center">
                        <span className="mr-2">⚠️</span> Confirmar Rechazo
                    </h3>
                </div>
                <div className="p-6">
                    <p className="text-slate-600 mb-4 font-medium text-sm">
                        Ingresa el motivo por el cual estás rechazando esta preinscripción. Este mensaje será enviado por correo al postulante.
                    </p>
                    <textarea 
                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-red-400 focus:ring-4 focus:ring-red-100 focus:outline-none transition-all duration-200 min-h-[120px] resize-none"
                        placeholder="Ej: El comprobante de pago está borroso, monto incorrecto..."
                        value={modalRechazo.motivo}
                        onChange={(e) => setModalRechazo({ ...modalRechazo, motivo: e.target.value })}
                        autoFocus
                    ></textarea>
                </div>
                <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end space-x-3">
                    <button 
                        className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl font-bold transition-colors"
                        onClick={() => setModalRechazo({ isOpen: false, id: null, motivo: '' })}
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button 
                        className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-lg shadow-red-500/30 transition-all disabled:opacity-50"
                        onClick={confirmarRechazo}
                        disabled={loading}
                    >
                        {loading ? 'Rechazando...' : 'Rechazar Solicitud'}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
