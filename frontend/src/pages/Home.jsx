import { useEffect, useState } from 'react';
import { useAuth } from '@context/AuthContext';
import escuelaConductoresImg from '@assets/Escuela-de-Conductores-Conduce.jpg';

export default function Home() {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };
  /* 
  const backgroundStyle = {
    backgroundImage: `url(${escuelaConductoresImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    filter: 'blur(2px)',
    opacity: 0.6,
    position: 'fixed',
    top: 0,
    left: '16rem',
    right: 0,
    bottom: 0,
    zIndex: 1
  };
  */

  const OLD_CLASS = "relative min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center";

  return (
    <div className="min-h-screen bg-slate-50 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Círculos decorativos de fondo */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[30rem] h-[30rem] bg-teal-200/40 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-8">
        {/* Tarjeta de Bienvenida */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-slate-200/50 border border-white p-8 md:p-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
             <svg className="w-64 h-64 text-emerald-900" fill="currentColor" viewBox="0 0 24 24"><path d="M21 16.5c0 .38-.21.71-.53.88l-7.9 4.44c-.16.12-.36.18-.57.18s-.41-.06-.57-.18l-7.9-4.44A.991.991 0 013 16.5v-9c0-.38.21-.71.53-.88l7.9-4.44c.16-.12.36-.18.57-.18s.41.06.57.18l7.9 4.44c.32.17.53.5.53.88v9zM12 4.15L5.46 7.82l6.54 3.67 6.54-3.67L12 4.15zM4.5 9.8v7.26l6.75 3.8v-7.26l-6.75-3.8zm15 7.26V9.8l-6.75 3.8v7.26l6.75-3.8z"/></svg>
          </div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full font-medium text-sm mb-6">
              <span className="animate-pulse w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>
                {user?.rol === 'secretario' ? 'Portal de Secretaría' : 
                 user?.rol === 'profesor' ? 'Portal del Profesor' : 
                 'Portal del Alumno'}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              {getGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">{user?.nombre || user?.email?.split('@')[0]}</span>
            </h1>
            
            <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
              {user?.rol === 'secretario' ? 'Te damos la bienvenida al panel de administración. Aquí podrás gestionar preinscripciones, administrar recursos y coordinar el funcionamiento general.' : 
               user?.rol === 'profesor' ? 'Te damos la bienvenida a tu panel de gestión académica. Aquí podrás organizar tus clases, registrar asistencias y monitorear a tus alumnos.' : 
               'Te damos la bienvenida a tu panel de control del curso de conducción. Aquí podrás gestionar tus clases, revisar tu progreso y mantenerte al día.'}
            </p>
          </div>
        </div>

        {/* Grid de Información */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card Hora */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg shadow-slate-200/40 border border-slate-100 p-6 flex items-start space-x-4 transition-transform hover:-translate-y-1 duration-300">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Hora actual</h3>
              <p className="text-3xl font-bold text-slate-800 tracking-tight">
                {currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </p>
              <p className="text-slate-500 text-sm mt-1 font-medium">
                {currentTime.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
          </div>

          {/* Card Perfil */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg shadow-slate-200/40 border border-slate-100 p-6 flex items-start space-x-4 transition-transform hover:-translate-y-1 duration-300">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            </div>
            <div className="overflow-hidden">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Tu perfil</h3>
              <p className="text-lg font-bold text-slate-800 truncate">
                {user?.nombre || user?.email?.split('@')[0]}
              </p>
              <p className="text-emerald-600 font-semibold capitalize text-sm">
                {user?.rol || 'Usuario'}
              </p>
              <p className="text-slate-500 text-xs mt-1 truncate">
                {user?.email}
              </p>
            </div>
          </div>

          {/* Card Próxima Acción */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl shadow-lg shadow-emerald-200 border border-emerald-500 p-6 flex flex-col justify-between text-white transition-transform hover:-translate-y-1 duration-300 md:col-span-2 lg:col-span-1">
            <div>
              <h3 className="text-emerald-100 font-medium mb-1">
                {user?.rol === 'secretario' ? 'Panel de Secretaría' : 
                 user?.rol === 'profesor' ? 'Agenda de Clases' : 
                 'Estado del curso'}
              </h3>
              <p className="text-2xl font-bold tracking-tight mb-2">
                {user?.rol === 'secretario' ? 'Al día' : 
                 user?.rol === 'profesor' ? 'Activa' : 
                 'Activo'}
              </p>
              <p className="text-emerald-50/80 text-sm leading-relaxed">
                {user?.rol === 'secretario' ? 'Revisa y gestiona las nuevas solicitudes de preinscripción.' : 
                 user?.rol === 'profesor' ? 'Revisa tu calendario para conocer tus próximas clases.' : 
                 'Revisa tu calendario para conocer tus próximas clases prácticas y teóricas.'}
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button className="px-5 py-2.5 bg-white text-emerald-700 font-bold rounded-xl text-sm hover:bg-emerald-50 transition-colors shadow-sm">
                {user?.rol === 'secretario' ? 'Ver Preinscripciones' : 'Ver Clases'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}