import { useState, useEffect } from 'react';
import { getTeacherList } from '../../services/profile.service.js';
import { getStudentList, programarExamen } from '../../services/examen.service.js';
import { fireDynamicSwal } from '../utils/dynamicSwal.jsx';

export const useProgramarExamen = (onSuccess) => {
    const [alumnos, setAlumnos] = useState([]);
    const [profesores, setProfesores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingLists, setLoadingLists] = useState(true);

    useEffect(() => {
        const cargarListas = async () => {
            setLoadingLists(true);
            try {
                const [listaAlumnos, listaProfesores] = await Promise.all([
                    getStudentList(),
                    getTeacherList(),
                ]);
                setAlumnos(listaAlumnos);
                setProfesores(listaProfesores);
            } catch (err) {
                console.error('Error al cargar listas de usuarios:', err);
            } finally {
                setLoadingLists(false);
            }
        };
        cargarListas();
    }, []);

    const handleSubmit = async (formData) => {
        setLoading(true);
        try {
            const response = await programarExamen(formData);
            await fireDynamicSwal(201, 'Examen programado', response?.message || 'El examen fue agendado exitosamente.');
            if (onSuccess) onSuccess();
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || 'Error desconocido al programar el examen.';
            const status = err?.response?.status || 500;
            await fireDynamicSwal(status, 'Error', msg);
        } finally {
            setLoading(false);
        }
    };

    return { alumnos, profesores, loading, loadingLists, handleSubmit };
};
