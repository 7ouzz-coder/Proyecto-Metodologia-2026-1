import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, preRegister } from '@services/auth.service.js';
import useLogin from '@hooks/useLogin.jsx';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    
    const [isPreRegister, setIsPreRegister] = useState(false);
    const [preRegisterData, setPreRegisterData] = useState({
        nombreCompleto: '',
        rut: '',
        email: '',
        telefono: '',
        fechaNacimiento: '',
        sede: '',
        plan: '',
        comprobantePagoUrl: '',
        aceptaTerminos: false
    });
    const [preRegisterSuccess, setPreRegisterSuccess] = useState('');
    const [preRegisterError, setPreRegisterError] = useState('');

    const {
        errorEmail,
        errorPassword,
        errorData,
        handleInputChange
    } = useLogin();

    const validateField = (name, value) => {
        let error = '';

        if (name === 'email') {
            if (!value) {
                error = 'El correo electrónico es requerido';
            } else if (value.length < 8) {
                error = 'El correo debe tener al menos 8 caracteres';
            } else if (value.length > 30) {
                error = 'El correo no puede tener más de 30 caracteres';
            } else if (!value.endsWith('@gmail.com')) {
                error = 'El correo debe terminar en @gmail.com';
            }
        }

        if (name === 'password') {
            if (!value) {
                error = 'La contraseña es requerida';
            } /*else if (value.length < 8) {
                error = 'La contraseña debe tener al menos 8 caracteres';
            }*/ else if (value.length > 26) {
                error = 'La contraseña no puede tener más de 26 caracteres';
            } else if (!/^[a-zA-Z0-9]+$/.test(value)) {
                error = 'Debe contener solo letras y números';
            }
        }

        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        const error = validateField(name, value);
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));

        handleInputChange(name, value);
    };

    const loginSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const emailError = validateField('email', formData.email);
        const passwordError = validateField('password', formData.password);

        if (emailError || passwordError) {
            setErrors({
                email: emailError,
                password: passwordError
            });
            setIsLoading(false);
            return;
        }

        try {
            const response = await login(formData);
            if (response.status === 'Success') {
                navigate('/home');
            } else {
                const errorMsg = response.message || response.details || 'Error desconocido al iniciar sesión';
                if (errorMsg.includes('Credenciales')) {
                    setErrors({ email: errorMsg, password: errorMsg });
                } else {
                    alert(errorMsg);
                }
                errorData(errorMsg);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePreRegisterChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPreRegisterData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const calcularEdad = (fechaNacimiento) => {
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const m = hoy.getMonth() - nacimiento.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        return edad;
    };

    const handlePreRegisterSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setPreRegisterSuccess('');
        setPreRegisterError('');

        if (!preRegisterData.aceptaTerminos) {
            setPreRegisterError('Debes aceptar los términos y condiciones.');
            setIsLoading(false);
            return;
        }

        const edad = calcularEdad(preRegisterData.fechaNacimiento);
        if (edad < 17) {
            setPreRegisterError('Debes tener al menos 17 años para inscribirte.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await preRegister(preRegisterData);
            if (response.status === 'Success' || (response.message && response.message.toLowerCase().includes('correcta'))) {
                setPreRegisterSuccess('¡Preinscripción enviada con éxito! La secretaria revisará tu comprobante y se creará tu usuario.');
                setPreRegisterData({
                    nombreCompleto: '',
                    rut: '',
                    email: '',
                    telefono: '',
                    fechaNacimiento: '',
                    sede: '',
                    plan: '',
                    comprobantePagoUrl: '',
                    aceptaTerminos: false
                });
            } else {
                setPreRegisterError(response.message || 'Error al enviar la preinscripción');
            }
        } catch (error) {
            setPreRegisterError('Error al conectar con el servidor');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-50 font-sans">
            {/* Panel Izquierdo - Branding & Decoración */}
            <div className="hidden lg:flex lg:flex-1 relative bg-gradient-to-br from-emerald-600 to-teal-900 items-center justify-center overflow-hidden">
                {/* Elementos decorativos abstractos */}
                <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
                
                <div className="relative z-10 p-16 flex flex-col items-start justify-center h-full max-w-xl text-white">
                    <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-md rounded-2xl mb-8 border border-white/20 shadow-xl">
                        <svg className="w-8 h-8 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    </div>
                    <h1 className="text-5xl font-extrabold mb-6 tracking-tight leading-tight">
                        Tu camino hacia la <span className="text-emerald-300">libertad</span> comienza aquí
                    </h1>
                    <p className="text-lg text-emerald-50 mb-10 leading-relaxed font-light">
                        Escuela de conducción profesional. Obtén tu licencia tipo A y B con los mejores instructores y vehículos modernos.
                    </p>
                    <div className="flex items-center space-x-4">
                        <div className="flex -space-x-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className={`w-10 h-10 rounded-full border-2 border-emerald-800 bg-emerald-200 flex items-center justify-center`} style={{ zIndex: 4-i }}>
                                    <span className="text-xs text-emerald-800 font-bold">★</span>
                                </div>
                            ))}
                        </div>
                        <p className="text-sm font-medium text-emerald-100">+500 alumnos aprobados</p>
                    </div>
                </div>
            </div>

            {/* Panel Derecho - Formulario */}
            <div className="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-20 relative bg-white">
                <div className="w-full max-w-md space-y-8 relative z-10">
                    {!isPreRegister ? (
                        <div className="animate-fade-in-up">
                            <div className="text-center mb-10">
                                <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">Bienvenido de nuevo</h2>
                                <p className="text-slate-500 font-medium">Ingresa tus credenciales para continuar</p>
                            </div>

                            <form onSubmit={loginSubmit} className="space-y-6">
                                {/* Campo Email */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 ml-1">Correo electrónico</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="ejemplo@gmail.com"
                                        className={`w-full px-5 py-4 bg-slate-50 border-2 rounded-xl text-slate-800 focus:bg-white focus:outline-none transition-all duration-200 placeholder-slate-400
                                            ${errors.email || errorEmail 
                                                ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                                                : 'border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100'}`}
                                        autoComplete="email"
                                        required
                                    />
                                    {(errors.email || errorEmail) && (
                                        <p className="text-red-500 text-sm mt-1 ml-1 font-medium flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                            {errors.email || errorEmail}
                                        </p>
                                    )}
                                </div>

                                {/* Campo Password */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 ml-1">Contraseña</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Ingresa tu contraseña"
                                            className={`w-full px-5 py-4 bg-slate-50 border-2 rounded-xl text-slate-800 focus:bg-white focus:outline-none transition-all duration-200 placeholder-slate-400 pr-12
                                                ${errors.password || errorPassword 
                                                    ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                                                    : 'border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100'}`}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                                        </button>
                                    </div>
                                    {(errors.password || errorPassword) && (
                                        <p className="text-red-500 text-sm mt-1 ml-1 font-medium flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                            {errors.password || errorPassword}
                                        </p>
                                    )}
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all duration-300
                                            ${isLoading
                                                ? 'bg-slate-400 cursor-not-allowed'
                                                : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-emerald-500/30 hover:-translate-y-0.5 active:translate-y-0'
                                            }`}
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                INICIANDO SESIÓN...
                                            </div>
                                        ) : (
                                            'INICIAR SESIÓN'
                                        )}
                                    </button>
                                </div>
                            </form>

                            <div className="mt-8 text-center border-t border-slate-100 pt-8">
                                <p className="text-slate-500">
                                    ¿No tienes cuenta?{' '}
                                    <button 
                                        onClick={() => { setIsPreRegister(true); setPreRegisterSuccess(''); setPreRegisterError(''); }}
                                        className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
                                    >
                                        Preinscríbete aquí
                                    </button>
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="animate-fade-in-up">
                            <div className="text-center mb-8">
                                <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">Preinscribirse</h2>
                                <p className="text-slate-500 font-medium">Completa tus datos para comenzar</p>
                            </div>

                            {preRegisterSuccess && (
                                <div className="p-4 mb-6 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start">
                                    <svg className="w-5 h-5 text-emerald-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                    <p className="text-sm font-medium text-emerald-800">{preRegisterSuccess}</p>
                                </div>
                            )}

                            {preRegisterError && (
                                <div className="p-4 mb-6 rounded-xl bg-red-50 border border-red-200 flex items-start">
                                    <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                                    <p className="text-sm font-medium text-red-800">{preRegisterError}</p>
                                </div>
                            )}

                            <form onSubmit={handlePreRegisterSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {['nombreCompleto', 'rut', 'email', 'telefono'].map((field) => (
                                        <div key={field}>
                                            <input
                                                type={field === 'email' ? 'email' : 'text'}
                                                name={field}
                                                value={preRegisterData[field]}
                                                onChange={handlePreRegisterChange}
                                                placeholder={
                                                    field === 'nombreCompleto' ? 'Nombre Completo' :
                                                    field === 'rut' ? 'RUT (ej: 12.345.678-9)' :
                                                    field === 'email' ? 'Correo Electrónico' :
                                                    'Teléfono'
                                                }
                                                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 focus:outline-none transition-all duration-200 placeholder-slate-400 text-sm"
                                                required
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-slate-500 font-bold ml-1 mb-1 block">Fecha de Nacimiento</label>
                                        <input
                                            type="date"
                                            name="fechaNacimiento"
                                            value={preRegisterData.fechaNacimiento}
                                            onChange={handlePreRegisterChange}
                                            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 focus:outline-none transition-all duration-200 text-sm"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-500 font-bold ml-1 mb-1 block">Sede Preferida</label>
                                        <input
                                            type="text"
                                            name="sede"
                                            value={preRegisterData.sede}
                                            onChange={handlePreRegisterChange}
                                            placeholder="Sede"
                                            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 focus:outline-none transition-all duration-200 text-sm"
                                            required
                                        />
                                    </div>
                                </div>
                                
                                {['plan', 'comprobantePagoUrl'].map((field) => (
                                    <div key={field}>
                                        <input
                                            type="text"
                                            name={field}
                                            value={preRegisterData[field]}
                                            onChange={handlePreRegisterChange}
                                            placeholder={
                                                field === 'plan' ? 'Plan a contratar' :
                                                'URL del Comprobante de Pago (o Drive link)'
                                            }
                                            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 focus:outline-none transition-all duration-200 placeholder-slate-400 text-sm"
                                            required
                                        />
                                    </div>
                                ))}

                                <div className="flex items-center space-x-3 py-2">
                                    <input 
                                        type="checkbox" 
                                        id="terminos" 
                                        name="aceptaTerminos"
                                        checked={preRegisterData.aceptaTerminos}
                                        onChange={handlePreRegisterChange}
                                        className="w-5 h-5 text-emerald-600 bg-slate-100 border-slate-300 rounded focus:ring-emerald-500"
                                    />
                                    <label htmlFor="terminos" className="text-sm text-slate-600 font-medium cursor-pointer">
                                        Acepto los términos, condiciones y tratamiento de mis datos personales (RUT/Email).
                                    </label>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all duration-300
                                            ${isLoading
                                                ? 'bg-slate-400 cursor-not-allowed'
                                                : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-emerald-500/30 hover:-translate-y-0.5 active:translate-y-0'
                                            }`}
                                    >
                                        {isLoading ? 'ENVIANDO...' : 'ENVIAR SOLICITUD'}
                                    </button>
                                </div>
                            </form>

                            <div className="mt-8 text-center border-t border-slate-100 pt-8">
                                <p className="text-slate-500">
                                    ¿Ya tienes cuenta?{' '}
                                    <button 
                                        onClick={() => { setIsPreRegister(false); setPreRegisterSuccess(''); setPreRegisterError(''); }}
                                        className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
                                    >
                                        Inicia sesión
                                    </button>
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

};

export default Login;
