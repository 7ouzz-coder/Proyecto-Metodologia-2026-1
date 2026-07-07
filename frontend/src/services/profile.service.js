import axios from './root.service.js';

export const STUDENT_ROLE = 'ESTUDIANTE';

export async function getProfile() {
    try {
        const response = await axios.get('/profile/private');
        return response.data;
    } catch (error) {
        return error.response?.data || { message: 'Error al obtener perfil' };
    }
}

export async function getUser(id) {
    try {
        const response = await axios.get(`/users/${id}`);
        return response.data;
    } catch (error) {
        return error.response?.data || { message: 'Error al obtener usuario' };
    }
}
export const getUserRole = () => {
   try {
        const user = JSON.parse(sessionStorage.getItem('usuario'));
        console.log(user);
        const rol = String(user?.rol || STUDENT_ROLE); 
        // console.log("ROL ACTUAL: " + rol);
        return rol;
    } catch (error) {
        console.error(error);
        return STUDENT_ROLE;
    }
}

export const getTeacherList = async () => {
    try {
        const response = await axios.get(`/users/frontend/getTeacherList`);
        return response?.data?.data || [];
    } catch (error) {
        console.error(error);
        return [];
    }    
}

// RF1/RF2: Obtener lista de alumnos activos (con estado "Activo" validado en backend)
export const getStudentList = async () => {
    try {
        const response = await axios.get(`/users/frontend/getStudentList`);
        return response?.data?.data || [];
    } catch (error) {
        console.error(error);
        return [];
    }    
}