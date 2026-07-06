import { getTeacherList } from "../../services/profile.service.js";

export const useGetTeacherList = (teacherList, setTeacherList) => {
    const fetchTeacherList = async () => {
        try {
            const data = await getTeacherList();
            //console.log(data);
            setTeacherList(data);
        } catch (error) {
            console.error("Error al obtener lista de profesores:", error);
            setTeacherList([]);
        }
    };

    return [teacherList, fetchTeacherList];
};
