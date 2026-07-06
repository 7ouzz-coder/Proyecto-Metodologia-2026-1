export const MIN_CLASES_PRACTICAS = 5;

export const TIPOS_VEHICULO = [
    { value: 'mecanico', label: 'Mecánico' },
    { value: 'automatico', label: 'Automático' },
];

export const ESTADOS_EXAMEN = {
    pendiente: { label: 'Pendiente', badge: 'badge-warning' },
    aprobado: { label: 'Aprobado', badge: 'badge-success' },
    reprobado: { label: 'Reprobado', badge: 'badge-error' },
};

export const CATEGORIAS_FALTAS = [
    {
        categoria: '1. Actitud al volante',
        faltas: [
            { code: 'L1', label: 'No ajusta espejo retrovisor interior', tipo: 'L' },
            { code: 'L2', label: 'No ajusta espejos exteriores', tipo: 'L' },
            { code: 'G1', label: 'No usa cinturón de seguridad', tipo: 'G' },
            { code: 'R1', label: 'Conducción bajo influencia del alcohol/drogas', tipo: 'R' },
        ],
    },
    {
        categoria: '2. Puesta en marcha',
        faltas: [
            { code: 'L3', label: 'No verifica punto muerto antes de arrancar', tipo: 'L' },
            { code: 'G2', label: 'Arranca en marcha distinta a la neutra', tipo: 'G' },
        ],
    },
    {
        categoria: '3. Velocidad',
        faltas: [
            { code: 'L4', label: 'Velocidad inadecuada para las condiciones', tipo: 'L' },
            { code: 'G3', label: 'Excede límite de velocidad permitido', tipo: 'G' },
            { code: 'R2', label: 'Supera 30 km/h el límite de velocidad', tipo: 'R' },
        ],
    },
    {
        categoria: '4. Dirección',
        faltas: [
            { code: 'L5', label: 'Agarre incorrecto del volante', tipo: 'L' },
            { code: 'L6', label: 'Movimientos bruscos innecesarios', tipo: 'L' },
            { code: 'G4', label: 'Pierde control de la dirección momentáneamente', tipo: 'G' },
        ],
    },
    {
        categoria: '5. Cambios de marcha (solo mecánico)',
        faltas: [
            { code: 'L7', label: 'Cambio de marcha tardío o prematuro', tipo: 'L' },
            { code: 'L8', label: 'No usa correctamente el embrague', tipo: 'L' },
            { code: 'G5', label: 'Cambia a marcha incorrecta generando riesgo', tipo: 'G' },
        ],
    },
    {
        categoria: '6. Frenado',
        faltas: [
            { code: 'L9', label: 'Frena de forma brusca sin necesidad', tipo: 'L' },
            { code: 'L10', label: 'No frena con anticipación suficiente', tipo: 'L' },
            { code: 'G7', label: 'Frena sin señalizar previamente', tipo: 'G' },
            { code: 'R3', label: 'Frenazo de emergencia por conducción descuidada', tipo: 'R' },
        ],
    },
    {
        categoria: '7. Señales de tránsito',
        faltas: [
            { code: 'L11', label: 'No observa correctamente las señales', tipo: 'L' },
            { code: 'G8', label: 'Ignora señal de PARE o CEDA el paso', tipo: 'G' },
            { code: 'R4', label: 'Pasa semáforo en rojo', tipo: 'R' },
        ],
    },
    {
        categoria: '8. Preferencia de paso',
        faltas: [
            { code: 'L12', label: 'No cede paso en intersección sin señalética', tipo: 'L' },
            { code: 'G9', label: 'Obliga a otro conductor a ceder bruscamente', tipo: 'G' },
        ],
    },
    {
        categoria: '9. Adelantamiento',
        faltas: [
            { code: 'L13', label: 'Adelanta sin señalizar correctamente', tipo: 'L' },
            { code: 'G10', label: 'Adelanta en zona prohibida', tipo: 'G' },
            { code: 'R5', label: 'Adelantamiento que provoca riesgo inminente', tipo: 'R' },
        ],
    },
    {
        categoria: '10. Giros y cambios de pista',
        faltas: [
            { code: 'L14', label: 'Señaliza muy tarde el giro', tipo: 'L' },
            { code: 'L15', label: 'No verifica punto ciego antes de girar', tipo: 'L' },
            { code: 'G11', label: 'Gira en zona prohibida', tipo: 'G' },
        ],
    },
    {
        categoria: '11. Estacionamiento',
        faltas: [
            { code: 'L16', label: 'Estacionamiento demasiado alejado del bordillo', tipo: 'L' },
            { code: 'L17', label: 'No frena de estacionamiento al detenerse', tipo: 'L' },
            { code: 'G12', label: 'Estaciona en lugar prohibido', tipo: 'G' },
        ],
    },
    {
        categoria: '12. Uso de luces',
        faltas: [
            { code: 'L18', label: 'No enciende luces al bajar visibilidad', tipo: 'L' },
            { code: 'G13', label: 'Usa luces altas frente a otro vehículo', tipo: 'G' },
        ],
    },
    {
        categoria: '13. Bocina y señales sonoras',
        faltas: [
            { code: 'L19', label: 'Uso innecesario de la bocina', tipo: 'L' },
            { code: 'G14', label: 'No usa bocina en situación de peligro', tipo: 'G' },
        ],
    },
    {
        categoria: '14. Comportamiento hacia peatones',
        faltas: [
            { code: 'L21', label: 'No reduce velocidad al acercarse a paso de cebra', tipo: 'L' },
            { code: 'G15', label: 'No cede paso a peatón en paso habilitado', tipo: 'G' },
            { code: 'R6', label: 'Pone en riesgo a un peatón', tipo: 'R' },
        ],
    },
    {
        categoria: '15. Maniobras especiales',
        faltas: [
            { code: 'L22', label: 'Ejecución deficiente de marcha atrás', tipo: 'L' },
            { code: 'L23', label: 'Cambio de dirección sin observar correctamente', tipo: 'L' },
            { code: 'L24', label: 'Deficiencias en cambio de pista', tipo: 'L' },
            { code: 'L25', label: 'Trayectoria irregular en conducción recta', tipo: 'L' },
            { code: 'L26', label: 'No mantiene distancia de seguridad adecuada', tipo: 'L' },
            { code: 'G16', label: 'Maniobra de retroceso peligrosa', tipo: 'G' },
            { code: 'G17', label: 'Cambio de dirección sin respetar prioridades', tipo: 'G' },
            { code: 'G18', label: 'Conducción en sentido contrario momentáneamente', tipo: 'G' },
            { code: 'G19', label: 'Distancia de seguridad insuficiente en ruta', tipo: 'G' },
            { code: 'G20', label: 'Giro en U en lugar no permitido', tipo: 'G' },
            { code: 'G21', label: 'Uso inadecuado de carriles especiales', tipo: 'G' },
            { code: 'R7', label: 'Maniobra que causa accidente o casi-accidente', tipo: 'R' },
        ],
    },
];
