import React from 'react';
import { Hero } from './Hero';
import { TrustSection } from './TrustSection';
import { ServicesHighlight } from './ServicesHighlight';
import { AboutStorySection } from './AboutStorySection';
import { AdvantagesSection } from './AdvantagesSection';
import { Support24Section } from './Support24Section';
import { TeamSection } from './TeamSection';
import { TestimonialsSection } from './TestimonialsSection';
import { FinalCTA } from './FinalCTA';

export const HomePage: React.FC = () => {
  return (
    <main>
      <Hero />
      <TrustSection />
      <ServicesHighlight />
      <AboutStorySection />
      <AdvantagesSection />
      <Support24Section />
      <TeamSection />
      <TestimonialsSection />
      <FinalCTA />
    </main>
  );
};
