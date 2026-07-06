
import { IoMdSettings } from 'react-icons/io';
import { MdDelete } from "react-icons/md";
//import { MdEmail } from "react-icons/md";

//import Clase from '../../../pages/Clase';
import DisplayTeacher from '../../../classes/DisplayTeacher.js';
//import { ENABLED_MAILTO, SIN_ASIGNAR } from '../../../constants/clase.constants.jsx';

/*import { NamePlusIcon } from './utils/NamePlusIcon.jsx';
import { GiGraduateCap } from 'react-icons/gi';*/
const formatDate = (date) => {
  const DEFAULT_DATE = "1-1-1970";
  try {
    const ISODate = new Date(date || 0).toISOString().split("T")[0];
    const dateArray = ISODate.split("-");
    return `${Number(dateArray[2] || 1)}-${Number(dateArray[1] || 1)}-${Number(dateArray[0] || 1970)}`;
  } catch (error) {
    console.error(error);
    return DEFAULT_DATE;
  }
};



const mostrarClases = (data, handleEditClase, handleDeleteClase, handleEditarAsignacion, loadingEditarAsignacion, canCrudClases, teacherList) => {
  if (Array.isArray(data) && data.length > 0) {
            /* console.log("EL DATA: ", JSON.stringify(data));
            console.log("TEACHER LIST: ", JSON.stringify(teacherList));
            const profesorCompleto = teacherList?.find(
                (t) => t?.email === Clase.email_profesor || t?.email === Clase.id_profesor
            );

            let nombreProfesor = "Sin asignar";
            if (typeof profesorCompleto === "string") {
                nombreProfesor = profesorCompleto.split("(")[0].trim();
            } else if (profesorCompleto && typeof profesorCompleto === "object") {
                nombreProfesor =
                    profesorCompleto.nombre ||
                    (profesorCompleto.first_name
                        ? `${profesorCompleto.first_name}`
                        : null) ||
                    (profesorCompleto.nombre && profesorCompleto.apellido
                        ? `${profesorCompleto.nombre} ${profesorCompleto.apellido}`
                        : null)||
                    "Sin asignar";
            } */
      return data.map((Clase) => {
        const currentTeacher = new DisplayTeacher(teacherList, Clase.id_profesor || 0);
        return (
                  <tr key={"Class-"+Clase.id_clase}>
                      <td>
                        <div className="badge badge-tertiary">
                          {String(Clase.tipo).toUpperCase()}
                        </div>
                      </td>
                      <td>
                        <div className="badge badge-tertiary pt-3 pb-3">
                          {Clase.descripcion}
                        </div>
                      </td>
                      <td>{formatDate(Clase.fecha_clase)}</td>
                      <td>{Clase.hora_inicio}</td>
                      <td>{Clase.hora_fin}</td>
                      <td>
                        <div className="badge badge-tertiary font-semibold">
                          {String(Clase.dia).toUpperCase()}
                        </div>
                      </td>
                      <td>
                        <div className="badge badge-tertiary">
                          {String(Clase.estado_clase).toUpperCase()}
                        </div>
                      </td>
                      <td>
                        <div className="badge badge-quaternary">
                          {currentTeacher.name}
                        </div>
                      </td>
                      {canCrudClases && (
                      <td>
                      <button className="btn btn-primary m-1" onClick={() => {handleEditClase(Clase.id_clase, Clase)}}><IoMdSettings></IoMdSettings></button>
                      <button className="btn btn-secondary m-1" onClick={() => {handleDeleteClase(Clase.id_clase, Clase)}}><MdDelete></MdDelete></button>
                      {Clase.tipo === "teorica" && (
                        <button
                          className='btn btn-info btn-sm m-1'
                          onClick={()=>{handleEditarAsignacion(Clase.id_clase)}}
                          disabled={loadingEditarAsignacion}
                        >
                          {loadingEditarAsignacion ? 'actualizando' : 'Editar asignacion'}
                        </button>
                      )}
                      </td>
                      )}
                  </tr>
      )});
  } else {
      return (
          <tr>
              <td colSpan="7">No hay clases disponibles.</td>
          </tr>
      )
  }
}
//{currentTeacher.name !== SIN_ASIGNAR && ENABLED_MAILTO ? <a href={`mailto:${currentTeacher.email}`}><button className="btn btn-warning m-1"><MdEmail /></button></a> : <></>}

export const DUClaseTable = ({data, handleEditClase, handleDeleteClase, handleEditarAsignacion, loadingEditarAsignacion, canCrudClases, teacherList}) => {

    return (
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 m-3 max-h-full">
        <table className="table">
            <thead>
            <tr>
                {/*<th></th> */} 
                <th>Tipo</th>
                <th>Descripcion</th>
                <th>fecha</th>
                <th>Hora Inicio</th>
                <th>Hora Término</th>
                <th>Día</th>
                <th>Estado clase</th>
                <th>Nombre profesor</th>
                {canCrudClases && (<th>Acciones</th>)}             
            </tr>
            </thead>
            <tbody>
              {mostrarClases(data, handleEditClase, handleDeleteClase, handleEditarAsignacion, loadingEditarAsignacion, canCrudClases, teacherList)}
            </tbody>
        </table>
        </div>
    ); 
}