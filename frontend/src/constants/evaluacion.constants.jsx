// Campos de evaluación
export const EVALUACION_CAMPOS = {
    ALUMNO: 'alumno',
    CALIFICACION_TEORICA: 'calificacion_teorica',
    RESULTADO_MANEJO_1: 'resultado_manejo_1',
    RESULTADO_MANEJO_2: 'resultado_manejo_2',
    RESULTADO_MANEJO_3: 'resultado_manejo_3',
    RESULTADO_MANEJO_4: 'resultado_manejo_4',
    RESULTADO_MANEJO_5: 'resultado_manejo_5',
    RESULTADO: 'Resultado',
    COMENTARIO: 'comentario',
};

// Resultados posibles para manejo
export const RESULTADOS_MANEJO = [
    { value: 0, label: 'Mal' },
    { value: 1, label: 'Bien' },
    { value: 2, label: 'Muy Bien' },
];

// Resultado general de evaluación
export const RESULTADOS_EVALUACION = [
    { value: 'evaluando', label: 'Evaluando' },
    { value: 'aprobado', label: 'Aprobado' },
    { value: 'reprobado', label: 'Reprobado' },
];

// Rangos de calificación teórica
export const MIN_CALIFICACION_TEORICA = 0;
export const MAX_CALIFICACION_TEORICA = 38;
