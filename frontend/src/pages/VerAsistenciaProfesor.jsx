import { useState, useEffect } from 'react';
import { useAuth } from '@context/AuthContext';
import axios from '@services/root.service.js';

export default function VerAsistenciaProfesor() {
  const { user } = useAuth();
  const [clases, setClases] = useState([]);
  const [claseSeleccionada, setClaseSeleccionada] = useState('');
  const [asistencias, setAsistencias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClases = async () => {
      try {
        const response = await axios.get('/clases');
        const misClases = response.data.data.filter(c => c.profesores && c.profesores.id === user.id);
        setClases(misClases);
      } catch (err) {
        console.error('Error fetching clases', err);
        setError('Error al cargar tus clases');
      }
    };
    if (user) {
      fetchClases();
    }
  }, [user]);

  const fetchAsistencia = async (claseId) => {
    if (!claseId) {
      setAsistencias([]);
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`/asistencia/clase/${claseId}`);
      setAsistencias(response.data.data);
    } catch (err) {
      console.error('Error fetching asistencia', err);
      setError('Error al cargar la asistencia de esta clase');
      setAsistencias([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClaseChange = (e) => {
    const id = e.target.value;
    setClaseSeleccionada(id);
    fetchAsistencia(id);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="card bg-base-100 shadow-xl p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">Ver Asistencia de Clase</h1>
        <p className="text-gray-600 mb-4">Profesor: <strong>{user?.nombre}</strong></p>
        
        <div className="form-control w-full max-w-md">
          <label className="label">
            <span className="label-text font-semibold">Seleccionar Clase</span>
          </label>
          <select 
            className="select select-bordered w-full"
            value={claseSeleccionada}
            onChange={handleClaseChange}
          >
            <option value="">Seleccione una clase...</option>
            {clases.map(c => (
              <option key={c.id_clase} value={c.id_clase}>
                {c.tipo} - {c.fecha_clase} ({c.hora_inicio} a {c.hora_fin})
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="alert alert-error mb-6 shadow-lg"><span>{error}</span></div>}

      {claseSeleccionada && (
        <div className="card bg-base-100 shadow-xl overflow-hidden">
          <div className="bg-base-200 p-4 border-b border-base-300 flex justify-between items-center">
            <h2 className="text-xl font-bold">Listado de Alumnos</h2>
            <button 
              onClick={() => fetchAsistencia(claseSeleccionada)} 
              className="btn btn-sm btn-ghost"
              disabled={loading}
            >
              ↻ Refrescar
            </button>
          </div>
          
          <div className="p-0">
            {loading ? (
              <div className="flex justify-center items-center p-12">
                <span className="loading loading-spinner loading-lg text-primary"></span>
              </div>
            ) : asistencias.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No hay alumnos registrados con reserva para esta clase.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th className="text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {asistencias.map((alumno, index) => (
                      <tr key={index} className="hover">
                        <td className="font-medium">{alumno.nombre}</td>
                        <td className="text-sm text-gray-500">{alumno.email}</td>
                        <td className="text-center">
                          {alumno.presente ? (
                            <div className="badge badge-success gap-1 text-white py-3 px-3 w-28">
                              ✓ Presente
                            </div>
                          ) : (
                            <div className="badge badge-error gap-1 text-white py-3 px-3 w-28">
                              ✗ Ausente
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
          
          {!loading && asistencias.length > 0 && (
            <div className="bg-base-200 p-4 text-sm text-center text-gray-600 border-t border-base-300">
              Total Presentes: <strong>{asistencias.filter(a => a.presente).length}</strong> / {asistencias.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
