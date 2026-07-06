import Swal from "sweetalert2";

const isPositive = (status) => {
    status = Number(status);
    return status >= 200 && status <= 299;
}

export const fireDynamicSwal = (status, title, text) => {
    return Swal.fire({
        title: (title) || (isPositive(status) ? "Éxito" : "Error"),
        text: text || (isPositive(status) ? "Operación exitosa" : "Hubo un error desconocido"),
        icon: isPositive(status) ? 'success' : 'error',
        theme: "light",
    });
}