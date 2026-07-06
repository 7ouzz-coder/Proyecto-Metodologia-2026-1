import Swal from "sweetalert2";
import { deleteClaseService } from "@services/clase.service.js";

async function confirmDeleteClase() {
  const result = await Swal.fire({
    title: "¿Estás seguro?",
    text: "No podrás deshacer esta acción",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    theme: "light",
  });
  return result.isConfirmed;
}

async function confirmAlert() {
  await Swal.fire({
    title: "Clase eliminada",
    text: "La clase ha sido eliminado correctamente",
    icon: "success",
    confirmButtonText: "Aceptar",
    theme: "light",
  });
}

async function confirmError() {
  await Swal.fire({
    title: "Error",
    text: "No se pudo eliminar la clase",
    icon: "error",
    confirmButtonText: "Aceptar",
    theme: "light",
  });
}

export const DeleteClase = (fetchClase) => {
  const handleDeleteClase = async (id_clase) => {
    try {
      const isConfirmed = await confirmDeleteClase();
      if (isConfirmed) {
        const response = await deleteClaseService(id_clase);
        if (response) {
          confirmAlert();
          await fetchClase();
        } else {
          confirmError();
        }
      }
    } catch (error) {
      // console.error("Error al eliminar la clase:", error);
      confirmError();
    }
  };

  return { handleDeleteClase };
};

export default DeleteClase;