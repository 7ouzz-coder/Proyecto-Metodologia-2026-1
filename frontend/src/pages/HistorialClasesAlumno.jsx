import { useEffect, useState } from 'react';
import { useAuth } from '@context/AuthContext';
import { getReservasUsuario } from '@services/reserva.service';
import { getUser } from '@services/profile.service';

export default function HistorialClasesAlumno() {
  const { user } = useAuth();
  const [reservas, setReservas] = useState([]);
  const [clasesDisponibles, setClasesDisponibles] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.id) {
      cargarHistorialYPerfil();
    } else if (user) {
      setError("Tu sesión está desactualizada. Por favor, cierra sesión y vuelve a entrar.");
      setLoading(false);
    }
  }, [user]);

  const cargarHistorialYPerfil = async () => {
    try {
      setLoading(true);
      

      const userData = await getUser(user.id);
      if (userData?.data?.data) {
        setClasesDisponibles(userData.data.data.clases_disponibles || 0);
      }


      const data = await getReservasUsuario(user.id);
      if (data && data.data) {
        setReservas(data.data);
      } else {
        setError(data.message || "Error al cargar historial");
      }
    } catch (err) {
      setError("Error al cargar historial");
    } finally {
      setLoading(false);
    }
  };

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case 'completada':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Completada</span>;
      case 'pendiente':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">Pendiente</span>;
      case 'no_realizada':
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">No Realizada</span>;
      case 'cancelada':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">Cancelada</span>;
      default:
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">{estado}</span>;
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Mi Historial de Clases</h1>
        <div className="bg-blue-100 border border-blue-200 px-4 py-2 rounded-lg flex items-center shadow-sm">
          <span className="text-blue-800 font-medium">Clases Disponibles:</span>
          <span className="ml-2 bg-blue-600 text-white text-lg font-bold px-3 py-1 rounded-md">
            {clasesDisponibles}
          </span>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-10"><span className="loading loading-spinner loading-lg"></span></div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {reservas.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No has registrado clases aún.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-sm font-medium text-gray-600">Fecha</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-600">Tipo de Clase</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-600">Vehículo</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-600">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {reservas.map((reserva) => (
                    <tr key={reserva.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {new Date(reserva.fecha).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 uppercase">
                        {reserva.clase ? reserva.clase.tipo : reserva.tipo}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {reserva.vehiculo ? `${reserva.vehiculo.patente} - ${reserva.vehiculo.transmision}` : 'N/A'}
                      </td>
                      <td className="px-4 py-3">
                        {getEstadoBadge(reserva.estado)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
