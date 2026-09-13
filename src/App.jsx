import logoDark from "../public/logoDark.png";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "./shared/layout/Navbar";
import { useState } from "react";

export default function MyApp() {
  const enlaces = [
    { text: "Inicio", url: "/" },
    { text: "Nosotros", url: "#about" },
    { text: "Alquila tu propiedad", url: "#formAlquiler" },
  ];

  const acciones = [
    { 
      text: "Tasar mi propiedad", 
      url: "#contacto", 
      className: "btn btn-outline-dark" 
    },
    { 
      text: "Ver propiedades", 
      url: "#propiedades", 
      className: "btn btn-warning" 
    },
    { 
      text: "", 
      url: "pages/admin/panelAdmin.html", 
      className: "btn btn-secondary px-3", 
      icon: true,
      ariaLabel: "Iniciar Sesión",
      title: "Panel de Administración"
    }
  ];

  return (
    <div>
      <NavBar 
        marca="Negocios Inmobiliarios" 
        logo={logoDark}
        enlaces={enlaces} 
        acciones={acciones} 
      />
    </div>
  );
}