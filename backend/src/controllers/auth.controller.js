import { loginUser } from "../services/auth.service.js";
import { createUser, findUsers, deleteUser } from "../services/user.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return handleErrorClient(res, 400, "Email y contraseña son requeridos");
    }
    
    const data = await loginUser(email, password);
    handleSuccess(res, 200, "Login exitoso", data);
  } catch (error) {
    handleErrorClient(res, 401, error.message);
  }
}

export async function register(req, res) {
  try {
    const data = req.body;
    
    if (!data.email || !data.password) {
      return handleErrorClient(res, 400, "Email y contraseña son requeridos");
    }
    
    const newUser = await createUser(data);
    delete newUser.password; // Nunca devolver la contraseña
    handleSuccess(res, 201, "Usuario registrado exitosamente", newUser);
  } catch (error) {
    if (error.code === '23505') { 
      handleErrorClient(res, 409, "El email ya está registrado");
    } else {
      handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
  }
}

export async function getUsers(req, res) {
  try {
    const users = await findUsers();
    const safeUsers = users.map(u => {
      const { password, ...rest } = u;
      return rest;
    });
    handleSuccess(res, 200, "Usuarios obtenidos exitosamente", safeUsers);
  } catch (error) {
    handleErrorServer(res, 500, "Error al obtener usuarios", error.message);
  }
}

export async function removeUser(req, res) {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return handleErrorClient(res, 400, "ID de usuario inválido");
    }
    
    const result = await deleteUser(parseInt(id));
    handleSuccess(res, 200, "Usuario eliminado exitosamente", result);
  } catch (error) {
    if (error.message === "Usuario no encontrado") {
      handleErrorClient(res, 404, error.message);
    } else {
      handleErrorServer(res, 500, "Error al eliminar usuario", error.message);
    }
  }
}
