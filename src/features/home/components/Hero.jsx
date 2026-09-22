import React from "react";
import "./Hero.css";
import heroImg from "../../../assets/hero.jpg"; // Asegurate de la ruta de tu imagen

export default function Hero() {
  return (
    <section className="hero-section" style={{ backgroundImage: `url(${heroImg})` }}>
      {/* Capa oscura y contenedor flex para centrar vertical y horizontalmente */}
      <div className="hero-overlay d-flex align-items-center text-center">
        <div className="container hero-content">
          
          <h1 className="hero-title">
            Tu próxima propiedad <br /> <strong>te está esperando</strong>
          </h1>
          
          <p className="hero-subtitle" >
            Encontrá casas, departamentos y PH en venta o alquiler en las mejores ubicaciones de Argentina, con asesoramiento profesional y operaciones seguras.
          </p>
          
          

        </div>
      </div>
    </section>
  );
}