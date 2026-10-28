// valida datos y llama al repo
import * as repository from './citas.repository.js';
import * as inmueblesRepository from '../inmuebles/inmuebles.repository.js';

const ESTADOS_VALIDOS = ['pendiente', 'confirmada', 'completada', 'cancelada'];

// solicitar una nueva cita
export const crearCita = async (usuario, { propiedadId, fecha, hora, mensaje }) => {
    // Solo los inquilinos pueden solicitar turnos de visita o sea con sesion iniciada
    if (usuario.rol !== 'inquilino') {
        return { forbidden: true, mensaje: 'Solo los inquilinos pueden solicitar citas' };
    }

    // Validar campos requeridos
    if (!propiedadId || !fecha || !hora) {
        return { datosInvalidos: true, mensaje: 'Propiedad, fecha y hora son obligatorios' };
    }

    // Verificar que la propiedad exista y este activa
    const propiedad = await inmueblesRepository.obtener(propiedadId);
    if (!propiedad) {
        return { noEncontrada: true, mensaje: 'El inmueble especificado no existe o no está disponible' };
    }

    // Crear en la base de datos
    const nuevaCita = await repository.crear({
        inquilinoId: usuario.id,
        propiedadId: Number(propiedadId),
        fecha,
        hora,
        mensaje,
    });

    return { nuevaCita };
};

// Obtener citas del usuario actual según su rol
export const obtenerCitas = async (usuario) => {
    const citas = await repository.obtenerPorUsuario(usuario);
    return { citas };
};

// Obtener detalle de una cita por su ID
export const obtenerCitaPorId = async (usuario, id) => {
    const cita = await repository.obtenerPorId(id);
    if (!cita) {
        return { noEncontrada: true };
    }

    // Validar si el usuario tiene permiso para ver esta cita
    const esInquilinoDeCita = usuario.rol === 'inquilino' && cita.inquilino_id === usuario.id;
    const esAgenteDeCita = usuario.rol === 'agente' && (cita.agente_id === usuario.id || !cita.agente_id);
    const esPropietarioDeCita = usuario.rol === 'propietario' && cita.propietario_id === usuario.id;
    const esAdmin = usuario.rol === 'admin';

    if (!esInquilinoDeCita && !esAgenteDeCita && !esPropietarioDeCita && !esAdmin) {
        return { forbidden: true, mensaje: 'No tienes permiso para acceder a esta cita' };
    }

    return { cita };
};

// Cambiar el estado de una cita (confirmada, cancelada, etc.)
export const cambiarEstado = async (usuario, id, nuevoEstado) => {
    // Validar que el estado enviado sea uno de los permitidos por Postgres
    if (!ESTADOS_VALIDOS.includes(nuevoEstado)) {
        return {
            datosInvalidos: true,
            mensaje: `Estado inválido. Debe ser uno de: ${ESTADOS_VALIDOS.join(', ')}`
        };
    }

    // Buscar si la cita existe
    const cita = await repository.obtenerPorId(id);
    if (!cita) {
        return { noEncontrada: true };
    }

    // Validar permisos para cambiar estado
    const esAdmin = usuario.rol === 'admin';
    const esAgenteAsignado = usuario.rol === 'agente' && (cita.agente_id === usuario.id || !cita.agente_id);
    const esInquilinoPropio = usuario.rol === 'inquilino' && cita.inquilino_id === usuario.id;

    // Un inquilino solo tiene permitido cancelar su propia cita
    if (esInquilinoPropio && nuevoEstado !== 'cancelada') {
        return { forbidden: true, mensaje: 'Los inquilinos únicamente pueden cancelar sus citas' };
    }

    // Si no es el agente, ni admin, ni el inquilino cancelando
    if (!esAdmin && !esAgenteAsignado && !esInquilinoPropio) {
        return { forbidden: true, mensaje: 'No tienes permisos para modificar el estado de esta cita' };
    }

    // 4. Actualizar en BD
    const citaActualizada = await repository.actualizarEstado(id, nuevoEstado);
    return { citaActualizada };
};
