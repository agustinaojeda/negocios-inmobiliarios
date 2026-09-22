import React from 'react';
import Hero from "../components/Hero";
import FeaturedGrid from "../components/FeaturedGrid";
import WhyUs from '../components/WhyUs';
import Testimonials from '../components/Testimonials';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <FeaturedGrid />
      <WhyUs />
      <Testimonials />
    </main>
  );
}