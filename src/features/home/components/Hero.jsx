import React, { useState, useEffect, useRef } from "react";
import "./Hero.css";
import heroImg from "../../../assets/hero.jpg"; 
import Buscador from "./Buscador";

// Subcomponente para animar los números individualmente
const AnimatedCounter = ({ target, suffix, startAnimation }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Si la animación aún no debe empezar, no hacemos nada
    if (!startAnimation) return;

    let current = 0;
    const increment = Math.ceil(target / 60);
    
    const timer = setInterval(() => {
      current = Math.min(current + increment, target);
      setCount(current);
      if (current >= target) clearInterval(timer);
    }, 24);

    return () => clearInterval(timer); // Limpieza del intervalo
  }, [startAnimation, target]);

  return (
    <div className="stat-value">
      {count.toLocaleString('es-AR')}{suffix}
    </div>
  );
};

export default function Hero() {
  const statsRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // IntersectionObserver al estilo React
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Dejamos de observar una vez que se activa
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect(); // Limpieza del observer al desmontar
  }, []);

  return (
    <section className="hero-section" style={{ backgroundImage: `url(${heroImg})` }}>
      <div className="hero-overlay d-flex align-items-center text-center">
        <div className="container hero-content mt-5 pt-5">
          
          <h1 className="hero-title">
            Tu próxima propiedad <br /> <strong>te está esperando</strong>
          </h1>
          
          <p className="hero-subtitle">
            Encontrá casas, departamentos y PH en venta o alquiler en las mejores ubicaciones de Argentina, con asesoramiento profesional y operaciones seguras.
          </p>
          
          {/* El Buscador Rápido que hicimos antes */}
          <Buscador />

          {/* Métricas de Confianza */}
          <div className="hero-stats" ref={statsRef}>
            <div className="stat-item">
              <AnimatedCounter target={850} suffix="+" startAnimation={isVisible} />
              <div className="stat-label">Propiedades activas</div>
            </div>
            
            <div className="stat-divider" aria-hidden="true"></div>

            <div className="stat-item">
              <AnimatedCounter target={1200} suffix="+" startAnimation={isVisible} />
              <div className="stat-label">Clientes satisfechos</div>
            </div>

            <div className="stat-divider" aria-hidden="true"></div>

            <div className="stat-item">
              <AnimatedCounter target={15} suffix=" años" startAnimation={isVisible} />
              <div className="stat-label">De experiencia</div>
            </div>
          </div>

          {/* Indicador de Scroll */}
          <div className="hero-scroll" aria-hidden="true">
            <span className="scroll-line"></span>
            Explorar
          </div>

        </div>
      </div>
    </section>
  );
}