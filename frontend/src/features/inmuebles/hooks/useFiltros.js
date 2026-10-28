//procesa, ordena y filtra los datos segun lo que selecciono el usuario en los filtros
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';

export function useFiltros(propiedades){
    const [searchParams, setSearchParams] = useSearchParams();
    const [categoria, setCategoria] = useState(searchParams.get('categoria') || 'todas'); //todas - casa - departamento - ph
    const [tipo, setTipo] = useState(searchParams.get('tipo') || 'todas'); //todas - venta - alquiler
    const [zona, setZona] = useState(searchParams.get('zona') || 'todas'); //todas - palermo - recoleta etc
    const [busqueda, setBusqueda] = useState(searchParams.get('buscar') || '');

    useEffect(() => {//actualiza la url en tiempo real
    const params = new URLSearchParams();

    if (categoria && categoria !== 'todas') params.set('categoria', categoria);
    if (tipo && tipo !== 'todas') params.set('tipo', tipo);
    if (zona && zona !== 'todas') params.set('zona', zona);
    if (busqueda.trim()) params.set('buscar', busqueda.trim());

    setSearchParams(params, { replace: true, preventScrollReset: true });
  }, [categoria, tipo, zona, busqueda, setSearchParams]);

    const lista = propiedades ?? [];

    const categorias = [...new Set(lista.map((p) => p.categoria))];
    const tipos = [...new Set(lista.map((p) => p.estado_comercial))];
    const zonas = [...new Set(lista.map((p) => p.zona))];
    const textoBuscado = busqueda.trim().toLowerCase();

    const propiedadesFiltradas = lista.filter(
    (p) =>
      (categoria === 'todas' || p.categoria === categoria) &&
      (tipo === 'todas' || p.categoria_comercial === tipo) && 
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