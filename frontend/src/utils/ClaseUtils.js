export const getTeacherEmail = (teacher) => {
    const DEFAULT_EMAIL = "juanitoperez@autitos.cl";
    if (typeof(teacher) !== "string") {
        return DEFAULT_EMAIL
    }
    try {
        const splitTeacher = teacher.split("(")[1];
        const trimmedTeacher = splitTeacher.substring(0, splitTeacher.length - 1);
        console.log("TRIMMED TEACHER: ", trimmedTeacher);
        return trimmedTeacher;
    } catch (error) {
        console.error(error);
        return DEFAULT_EMAIL;
    }
}

export const getTeacherNombre = (teacher) => {
    const DEFAULT_NAME = "juanito perez";
    if (typeof(teacher) !== "string") {
        return DEFAULT_NAME
    }
    try {
        const splitTeacher = teacher.split("(")[0];
        const nameTeacher = splitTeacher.substring(0, splitTeacher.length - 1);
        const nameTeacherWithoutId = nameTeacher.split(". ")[1];
        console.log("TRIMMED TEACHER: ", nameTeacherWithoutId);
        return nameTeacherWithoutId;
    } catch (error) {
        console.error(error);
        return DEFAULT_NAME;
    }
}

export const getTeacherEmailFromTeacherList = (teacher) => {
    const DEFAULT_EMAIL = "juanitoperez@gmail.com";
    if (!teacher || (typeof(teacher) !== "string")) {
        return DEFAULT_EMAIL
    }

    try {
        teacher = teacher.split("(")[1];

    } catch (error) {
        console.error(error);
        return DEFAULT_EMAIL;
    }
}

export const processTeachers = (teachers) => {
    console.log("LOS PROFES: ", JSON.stringify(teachers));

    const DEFAULT_TEACHER = "Juanito Perez (juanitoperez@gmail.com)";

    if (!Array.isArray(teachers)) {
        return [];
    }

    const newTeachers = teachers.map((teacher) => {
        try {
            if (typeof(teacher) !== "string") {
                console.error("El profesor debe ser un string: ", teacher);
                return DEFAULT_TEACHER;
            }

            return teacher.split(". ")[1] || DEFAULT_TEACHER;
        } catch (error) {
            console.error(error);
            return DEFAULT_TEACHER;
        }
    });
    return newTeachers;
}