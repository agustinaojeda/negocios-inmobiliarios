import React, { useState } from "react";
import SeccionPropiedades from "../../../shared/components/propiedades/SeccionPropiedades";
import { obtenerPropiedadesDisponibles } from "../../inmuebles/services/inmueblesService";
import { useFetch } from "../../../shared/hooks/useFetch";
import FiltroPills from "../../inmuebles/components/FiltroPills";
import "./filtro-compacto.css";

export default function AlertasPrecio() {
  const {
    datos: respuesta = [],
    cargando,
    error,
  } = useFetch(obtenerPropiedadesDisponibles);

  const [tipoOperacion, setTipoOperacion] = useState("todas");

  let todas = Array.isArray(respuesta)
    ? respuesta
    : respuesta?.propiedades || respuesta?.data || [];

  const filtradasPorOperacion =
    tipoOperacion === "todas"
      ? todas
      : todas.filter(
          (p) => p.tipo?.toLowerCase() === tipoOperacion.toLowerCase(),
        );

  const masBaratas = [...filtradasPorOperacion]
    .sort((a, b) => Number(a.precio) - Number(b.precio))
    .slice(0, 6);

  return (
    <SeccionPropiedades
      titulo="Alertas de Precio"
      subtitulo={
        tipoOperacion === "todas"
          ? `Las ${masBaratas.length} propiedades con los precios más bajos`
          : `Las ${masBaratas.length} más económicas en ${tipoOperacion}`
      }
      propiedades={masBaratas}
      cargando={cargando}
      error={error}
      textoCargando="Cargando mejores ofertas..."
      vacio={{
        titulo: `No hay propiedades en ${tipoOperacion}`,
        texto:
          "No encontramos oportunidades disponibles con el filtro seleccionado.",
        linkTo: "/inmuebles",
        linkTexto: "Explorar Catálogo Completo",
      }}
    >
      <div className="mb-3 mx-3 filtro-compacto">
        <FiltroPills
          titulo="Filtrar por tipo de operación:"
          opciones={["todas", "alquiler", "venta"]}
          seleccionado={tipoOperacion}
          onSeleccionar={setTipoOperacion}
        />
      </div>
    </SeccionPropiedades>
  );
}
