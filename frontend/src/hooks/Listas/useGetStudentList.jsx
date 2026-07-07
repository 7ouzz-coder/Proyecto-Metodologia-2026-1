import { getStudentList } from "../../services/profile.service.js";

// RF1/RF2: Hook para obtener lista de alumnos activos validados por el backend
export const useGetStudentList = (studentList, setStudentList) => {
    const fetchStudentList = async () => {
        try {
            const data = await getStudentList();
            setStudentList(data);
        } catch (error) {
            console.error("Error al obtener lista de alumnos:", error);
            setStudentList([]);
        }
    };

    return [studentList, fetchStudentList];
};
