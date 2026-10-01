//procesa, ordena y filtra los datos segun lo que selecciono el usuario en los filtros
import { useState } from 'react'

export function useFiltros(propiedades){
    const [categoria, setCategoria] = useState('todas'); //todas - casa - departamento - ph
    const [tipo, setTipo] = useState('todas'); //todas - venta - alquiler
    const [zona, setZona] = useState('todas'); //todas - palermo - recoleta etc
    const [busqueda, setBusqueda] = useState('');

    const lista = propiedades ?? [];

    const categorias = [...new Set(lista.map((p) => p.categoria))];
    const tipos = [...new Set(lista.map((p) => p.tipo))];
    const zonas = [...new Set(lista.map((p) => p.zona))];
    const textoBuscado = busqueda.trim().toLowerCase();

    const propiedadesFiltradas = lista.filter(
    (p) =>
      (categoria === 'todas' || p.categoria === categoria) &&
      (tipo === 'todas' || p.tipo === tipo) && 
      (zona === 'todas' || p.zona === zona) &&
      (p.titulo.toLowerCase().includes(textoBuscado) ||
      p.zona.toLowerCase().includes(textoBuscado)),
    );

    const hayFiltrosActivos = categoria !== 'todas' || tipo !== 'todas' || zona !== 'todas' || textoBuscado !== '';

    function limpiarFiltros(){
        setCategoria('todas');
        setTipo('todas');
        setZona('todas');
        setBusqueda('');
    }

    return {
    categoria,
    setCategoria,
    tipo,
    setTipo,
    zona,
    setZona,
    busqueda,
    setBusqueda,
    categorias,
    tipos,
    zonas,
    propiedadesFiltradas,
    hayFiltrosActivos,
    limpiarFiltros,
    }
}