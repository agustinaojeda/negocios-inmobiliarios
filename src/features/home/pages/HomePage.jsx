import React, { useState } from 'react';
import Hero from "../components/Hero";
import FeaturedGrid from "../components/FeaturedGrid";
import WhyUs from '../components/WhyUs';
import Testimonials from '../components/Testimonials';
import SeccionContacto from '../components/SeccionContacto';
import Calculadora from '../components/Calculadora';

export default function HomePage() {
    const [busqueda, setBusqueda] = useState('');
  return (
    <main>
      <Hero busqueda={busqueda} onBuscar={setBusqueda} />
      <FeaturedGrid busqueda={busqueda} />
      <WhyUs />
      <Testimonials />
      <SeccionContacto />
      <Calculadora />
    </main>
  );
}