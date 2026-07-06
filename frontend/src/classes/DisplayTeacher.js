import { SIN_ASIGNAR } from "../constants/clase.constants.jsx";

const DEFAULT_TEACHER = "0. Sin asignar (juanitoperez@gmail.com)";
const DEFAULT_ID = 0;
const DEFAULT_NAME = SIN_ASIGNAR;
const DEFAULT_EMAIL = "juanitoperez@gmail.com";

const findTeacher = (teacherList, id) => {
    if (!Array.isArray(teacherList)) {
        return DEFAULT_TEACHER;
    }

    const foundTeacher = teacherList.find((t) => {
        try {
            if (typeof(t) !== "string") {
                console.error("Profesor desconocido: ", String(t));
                return false;
            }

            const newID = t.split(". ")[0];
            return Number(newID.trim()) === Number(id);
        } catch (error) {
            console.error(error);
            return false;
        }
    }) || DEFAULT_TEACHER;
    return String(foundTeacher);
}

export class DisplayTeacher {
    constructor(teacherList = [], id = 0) {
        try {
            // "0. Juanito Perez (juanitoperez@gmail.com)" 
            const foundTeacher = findTeacher(teacherList, id);
            this._id = Number(foundTeacher.split(". ")[0].trim());
            this._name = foundTeacher.split(". ")[1].split("(")[0].trim();
            this._email = foundTeacher.split("(")[1].replaceAll(")", "").trim();
        } catch (error) {
            console.error(error);
            this._id = DEFAULT_ID;
            this._name = DEFAULT_NAME;
            this._email = DEFAULT_EMAIL;
        }
    }

    get id() {
        return Number(this._id || DEFAULT_ID);
    }    
    set id(id) {
        this._id = Number(id);
    }

    get name() {
        return String(this._name || DEFAULT_NAME);
    }
    set name(name) {
        this._name = String(name || DEFAULT_NAME);
    }

    get email() {
        return String(this._email || DEFAULT_EMAIL);
    }
    set email(email) {
        this._email = String(email || DEFAULT_EMAIL);
    }
}

export default DisplayTeacher;