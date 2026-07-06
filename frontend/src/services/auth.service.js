import axios from './root.service.js';
import cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export async function login(dataUser) {
    try {
        const response = await axios.post('/auth/login', {
            email: dataUser.email,
            password: dataUser.password
        });

        const { status, data} = response;

        if(status === 200){
            const token = data.data.token;
            const { sub, nombre, email, rol } = jwtDecode(token);
            const userData = {id: sub, nombre, email, rol}

            sessionStorage.setItem('usuario', JSON.stringify(userData));
            cookies.set('jwt-auth', data.data.token, { path: '/' });
        
            return response.data;
        }
    } catch (error) {
        return error.response?.data || { message: 'Error al conectar con el servidor' };
    }
}

export async function register(data) {
    try {
        const { email, password } = data;
        const response = await axios.post('/auth/register', {
            email,
            password
        });
        return response.data;
    } catch (error) {
        return error.response?.data || { message: 'Error al conectar con el servidor' };
    }
}

export async function preRegister(data) {
    try {
        const response = await axios.post('/preregistro', data);
        return response.data;
    } catch (error) {
        return error.response?.data || { message: 'Error al conectar con el servidor' };
    }
}

export async function logout() {
    try {
        await axios.post('/auth/logout');
        sessionStorage.removeItem('usuario');
        cookies.remove('jwt-auth');
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
}
