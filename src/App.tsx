import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeroSection from './sections/HeroSection';
import MarqueeSection from './sections/MarqueeSection';
import AboutSection from './sections/AboutSection';
import ServicesSection from './sections/ServicesSection';
import ProjectsSection from './sections/ProjectsSection';
import ConsultationPage from './sections/ConsultationPage';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'consultation'>('home');

  const handleNavigate = (page: 'home' | 'consultation') => {
    setCurrentPage(page);
    // Instantly scroll back to the top of the viewport
    window.scrollTo(0, 0);
  };

  return (
    <div 
      className="bg-[#0C0C0C] min-h-screen text-[#D7E2EA]"
      style={{ overflowX: 'clip' }}
    >
      <AnimatePresence mode="wait">
        {currentPage === 'home' ? (
          <motion.div
            key="home"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
          >
            <HeroSection onBookConsultation={() => handleNavigate('consultation')} />
            <MarqueeSection />
            <AboutSection onBookConsultation={() => handleNavigate('consultation')} />
            <ServicesSection />
            <ProjectsSection onBookConsultation={() => handleNavigate('consultation')} />
          </motion.div>
        ) : (
          <motion.div
            key="consultation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          >
            <ConsultationPage onBack={() => handleNavigate('home')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
