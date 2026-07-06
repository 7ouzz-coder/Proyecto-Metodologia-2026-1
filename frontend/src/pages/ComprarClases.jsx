import { useEffect, useState } from 'react';
import { useAuth } from '@context/AuthContext';
import { useVentas } from '../hooks/useVentas';

export default function ComprarClases() {
  const { user } = useAuth();
  const { getClasesDisponibles, getHistorialVentas, comprarPack, loading, error } = useVentas();
  
  const [clasesDisponibles, setClasesDisponibles] = useState(0);
  const [historial, setHistorial] = useState([]);
  const [cantidad, setCantidad] = useState(1);
  const [comprobanteFile, setComprobanteFile] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    if (user?.id) {
      cargarDatos();
    }
  }, [user]);

  const cargarDatos = async () => {
    try {
      const dataClases = await getClasesDisponibles(user.id);
      setClasesDisponibles(dataClases.data.clases_disponibles);

      const dataHistorial = await getHistorialVentas(user.id);
      setHistorial(dataHistorial.data);
    } catch (err) {
      console.error("Error al cargar datos", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje(null);
    if (!cantidad || !comprobanteFile) {
      setMensaje({ type: 'error', text: 'Por favor completa todos los campos.' });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('userId', user.id);
      formData.append('cantidad', Number(cantidad));
      formData.append('comprobante', comprobanteFile);

      await comprarPack(formData);
      
      setMensaje({ type: 'success', text: 'Solicitud enviada correctamente. Pendiente de aprobación.' });
      setCantidad(1);
      setComprobanteFile(null);
      // Resetear el input de archivo
      document.getElementById('comprobante-input').value = '';
      cargarDatos();
    } catch (err) {
      setMensaje({ type: 'error', text: err.message || 'Error al enviar la solicitud.' });
    }
  };

  if (user?.rol !== 'estudiante') {
    return (
      <div className="flex justify-center mt-10">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          No tienes permisos para ver esta página.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Comprar Clases Extras</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Panel izquierdo: Formulario y Clases disponibles */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-green-500">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Tus Clases Disponibles</h2>
            <div className="text-4xl font-bold text-green-600">
              {clasesDisponibles}
            </div>
            <p className="text-sm text-gray-500 mt-2">Clases listas para agendar</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Solicitar Pack</h2>
            
            {mensaje && (
              <div className={`p-3 rounded-lg mb-4 text-sm ${mensaje.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {mensaje.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cantidad de clases
                </label>
                <input
                  type="number"
                  min="1"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subir Comprobante (Imagen o PDF)
                </label>
                <input
                  id="comprobante-input"
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,application/pdf"
                  onChange={(e) => setComprobanteFile(e.target.files[0])}
                  className="w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-green-50 file:text-green-700
                    hover:file:bg-green-100 border border-gray-300 p-1 rounded-lg"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                {loading ? 'Enviando...' : 'Enviar Solicitud'}
              </button>
            </form>
          </div>
        </div>

        {/* Panel derecho: Historial */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Historial de Solicitudes</h2>
            
            {historial.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No tienes solicitudes previas.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-sm font-medium text-gray-600">Fecha</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-600">Cantidad</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-600">Comprobante</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-600">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historial.map((venta) => (
                      <tr key={venta.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {new Date(venta.fecha_venta).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">{venta.cantidad}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          <a 
                            href={`http://localhost:3000${venta.comprobante_url}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Ver comprobante
                          </a>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            venta.estado === 'aprobado' ? 'bg-green-100 text-green-800' : 
                            venta.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {venta.estado.charAt(0).toUpperCase() + venta.estado.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
