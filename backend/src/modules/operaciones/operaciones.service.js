import * as repository from './operaciones.repository.js';
import * as inmueblesRepository from '../inmuebles/inmuebles.repository.js';

// Registrar una nueva operación (venta o contrato de alquiler cerrado)
export const crearOperacion = async (usuario, datos) => {
    const {
        propiedadId,
        clienteId,
        moneda = 'USD',
        montoCierre,
        fechaInicioContrato,
        fechaFinContrato,
    } = datos;

    // Permisos: Solo agentes o administradores pueden asentar operaciones
    if (usuario.rol !== 'agente' && usuario.rol !== 'admin') {
        return {
            forbidden: true,
            mensaje: 'Solo los agentes o administradores pueden registrar operaciones comerciales',
        };
    }

    // Validar campos obligatorios
    if (!propiedadId || !clienteId || !montoCierre) {
        return {
            datosInvalidos: true,
            mensaje: 'El inmueble, el cliente y el monto de cierre son obligatorios',
        };
    }

    // Validar monto positivo
    const montoNum = Number(montoCierre);
    if (isNaN(montoNum) || montoNum <= 0) {
        return {
            datosInvalidos: true,
            mensaje: 'El monto de cierre debe ser un número mayor a cero',
        };
    }

    // Validar moneda permitida
    const monedaValida = moneda.toUpperCase();
    if (!['ARS', 'USD'].includes(monedaValida)) {
        return {
            datosInvalidos: true,
            mensaje: 'La moneda debe ser ARS o USD',
        };
    }

    // Verificar que el inmueble exista y no esté ya dado de baja
    const propiedad = await inmueblesRepository.obtener(propiedadId, true);
    if (!propiedad) {
        return {
            noEncontrada: true,
            mensaje: 'El inmueble especificado no existe',
        };
    }

    if (propiedad.estado_visibilidad === 'inactivo') {
        return {
            conflicto: true,
            mensaje: 'El inmueble ya no está disponible (se encuentra inactivo o ya fue concretado)',
        };
    }

    // Si es agente, verificar que tenga asignado el inmueble (o que no tenga agente asignado aún)
    if (usuario.rol === 'agente' && propiedad.agente_id && propiedad.agente_id !== usuario.id) {
        return {
            forbidden: true,
            mensaje: 'No tienes permisos para cerrar operaciones sobre un inmueble asignado a otro asesor',
        };
    }

    // Persistir la operación en base de datos
    const nuevaOperacion = await repository.crear({
        propiedadId: Number(propiedadId),
        clienteId: Number(clienteId),
        moneda: monedaValida,
        montoCierre: montoNum,
        fechaInicioContrato,
        fechaFinContrato,
    });

    return { nuevaOperacion };
};

// Obtener operaciones según rol y filtro opcional por tipo
export const obtenerOperaciones = async (usuario, filtros = {}) => {
    const operaciones = await repository.obtenerTodas({
        usuario,
        tipo: filtros.tipo,
    });
    return { operaciones };
};

// Obtener detalle de una operación puntual por ID
export const obtenerOperacionPorId = async (usuario, id) => {
    const operacion = await repository.obtenerPorId(id);
    if (!operacion) {
        return { noEncontrada: true };
    }

    // Validar permisos de visualización
    const esAdmin = usuario.rol === 'admin';
    const esAgente = usuario.rol === 'agente' && (operacion.agente_id === usuario.id || !operacion.agente_id);
    const esPropietario = usuario.rol === 'propietario' && operacion.propietario_id === usuario.id;
    const esCliente = operacion.cliente_id === usuario.id;

    if (!esAdmin && !esAgente && !esPropietario && !esCliente) {
        return {
            forbidden: true,
            mensaje: 'No tienes permisos para visualizar esta operación comercial',
        };
    }

    return { operacion };
};
