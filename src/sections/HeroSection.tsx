import { useEffect } from 'react';
import { useMotionValue, useSpring, useTransform, motion } from 'framer-motion';
import { FadeIn } from '../components/FadeIn';
import { ContactButton } from '../components/Buttons';

interface HeroSectionProps {
  onBookConsultation: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onBookConsultation }) => {
  const handleScrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Mouse-reactive parallax movements for ambient light and orb centerpiece
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Faster, more responsive spring physics for active cursor tracking
  const springConfig = { damping: 20, stiffness: 100 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      // Increased sensitivity (divide by 15 instead of 30)
      const x = (clientX - window.innerWidth / 2) / 15;
      const y = (clientY - window.innerHeight / 2) / 15;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);

  // Transform vectors for multi-layered background depth parallax
  const xLayer1 = springX;
  const yLayer1 = springY;

  const xLayer2 = useTransform(springX, (val) => val * -1.3);
  const yLayer2 = useTransform(springY, (val) => val * -1.3);

  // Stronger multiplier (2.2) so the orb follows the cursor actively
  const xLayer3 = useTransform(springX, (val) => val * 2.2);
  const yLayer3 = useTransform(springY, (val) => val * 2.2);

  // 3D rotation tilt values based on cursor offset
  const rotateY = useTransform(springX, (val) => val * 1.8);
  const rotateX = useTransform(springY, (val) => val * -1.8);

  return (
    <section className="relative h-screen flex flex-col justify-between overflow-hidden bg-[#0C0C0C] select-none">
      {/* Premium Grain Noise Overlay */}
      <div className="absolute inset-0 noise-overlay pointer-events-none z-[2]" />

      {/* Abstract Glowing Aura Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Blob 1: Purple-Magenta Glow */}
        <motion.div
          style={{ x: xLayer1, y: yLayer1 }}
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -30, 40, 0],
            scale: [1, 1.15, 0.9, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-[10%] left-[10%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-tr from-[#7621B0]/15 to-[#B600A8]/10 blur-[90px] sm:blur-[120px] md:blur-[160px] opacity-75"
        />

        {/* Blob 2: Blue Accent Glow */}
        <motion.div
          style={{ x: xLayer2, y: yLayer2 }}
          animate={{
            x: [0, -50, 40, 0],
            y: [0, 40, -50, 0],
            scale: [1, 0.85, 1.2, 1],
          }}
          transition={{
            duration: 32,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute bottom-[10%] right-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-[#0052D4]/12 to-[#4364F7]/8 blur-[100px] sm:blur-[140px] md:blur-[180px] opacity-65"
        />

        {/* Blob 3: Orange-Purple Fusion Glow */}
        <motion.div
          style={{ x: xLayer3, y: yLayer3 }}
          animate={{
            x: [0, 30, -45, 0],
            y: [0, -35, 30, 0],
            scale: [0.9, 1.12, 1, 0.9],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-[35%] left-[30%] w-[35vw] h-[35vw] rounded-full bg-gradient-to-r from-[#BE4C00]/12 to-[#7621B0]/8 blur-[80px] sm:blur-[110px] md:blur-[150px] opacity-55"
        />
      </div>

      {/* Navbar */}
      <FadeIn delay={0} y={-20} className="w-full z-20">
        <nav className="flex justify-between items-center w-full px-6 md:px-10 pt-6 md:pt-8 text-sm md:text-lg lg:text-[1.4rem] text-[#D7E2EA] font-medium uppercase tracking-wider">
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              handleScrollToSection('about');
            }}
            className="hover:opacity-70 transition-opacity duration-200"
          >
            About
          </a>
          <a
            href="#services"
            onClick={(e) => {
              e.preventDefault();
              handleScrollToSection('services');
            }}
            className="hover:opacity-70 transition-opacity duration-200"
          >
            Services
          </a>
          <a
            href="#projects"
            onClick={(e) => {
              e.preventDefault();
              handleScrollToSection('projects');
            }}
            className="hover:opacity-70 transition-opacity duration-200"
          >
            Projects
          </a>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              handleScrollToSection('contact');
            }}
            className="hover:opacity-70 transition-opacity duration-200"
          >
            Contact
          </a>
        </nav>
      </FadeIn>

      {/* Hero Content Container (Using overflow-visible to prevent orb clipping) */}
      <div className="flex-grow flex items-center justify-center relative w-full overflow-visible z-10">
        {/* Outer Parallax & 3D Tilt Wrapper */}
        <motion.div
          style={{
            x: xLayer3,
            y: yLayer3,
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
            perspective: 1000,
          }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.5,
            duration: 1.6,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-0 w-[260px] sm:w-[340px] md:w-[420px] lg:w-[480px] aspect-square rounded-full pointer-events-none select-none"
        >
          {/* Inner Floating Movement Wrapper (Faster flowy floats) */}
          <motion.div
            animate={{
              y: [0, -15, 12, -7, 0],
              x: [0, 8, -8, 4, 0],
            }}
            transition={{
              y: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
              x: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
            }}
            className="w-full h-full relative"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Outer Aura Glow */}
            <div className="absolute inset-[-15%] rounded-full bg-gradient-to-tr from-[#7621B0]/25 via-[#B600A8]/15 to-[#BE4C00]/15 blur-[50px] sm:blur-[75px] md:blur-[95px] opacity-80" />

            {/* Core Glass Sphere */}
            <div 
              className="absolute inset-0 rounded-full border border-white/20 backdrop-blur-[12px] sm:backdrop-blur-[18px]"
              style={{
                background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 60%, rgba(255, 255, 255, 0) 100%)',
                boxShadow: 'inset 0 15px 25px rgba(255, 255, 255, 0.12), inset 0 -15px 25px rgba(118, 33, 176, 0.25), 0 25px 50px rgba(0, 0, 0, 0.55)',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Top-Left Rim Light Highlight (3D Depth Offset) */}
              <div 
                className="absolute inset-[2%] rounded-full border-t-[1.5px] border-l-[1.5px] border-white/25 filter blur-[0.5px]" 
                style={{ transform: 'translateZ(30px)' }}
              />

              {/* Bottom-Right Color Highlight (3D Depth Offset) */}
              <div 
                className="absolute inset-[2%] rounded-full border-b-[2px] border-r-[2px] border-[#B600A8]/30 filter blur-[1px]" 
                style={{ transform: 'translateZ(-15px)' }}
              />
              
              {/* Internal Refracting Organic Layers with different Z-depths for 3D parallax parallax inside */}
              {/* Layer A (Magenta) - Foreground */}
              <motion.div 
                animate={{
                  x: [0, 12, -9, 0],
                  y: [0, -12, 9, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute top-[15%] left-[15%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-[#B600A8]/30 to-transparent blur-[12px]" 
                style={{ transform: 'translateZ(20px)' }}
              />

              {/* Layer B (Orange) - Background */}
              <motion.div 
                animate={{
                  x: [0, -9, 12, 0],
                  y: [0, 9, -12, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute bottom-[15%] right-[15%] w-[45%] h-[45%] rounded-full bg-gradient-to-br from-[#BE4C00]/25 to-transparent blur-[10px]" 
                style={{ transform: 'translateZ(-20px)' }}
              />

              {/* Layer C (Blue-Purple) - Midground */}
              <motion.div 
                animate={{
                  x: [0, 7, -9, 0],
                  y: [0, -7, 7, 0],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute top-[35%] right-[25%] w-[35%] h-[35%] rounded-full bg-gradient-to-r from-[#0052D4]/25 to-transparent blur-[8px]" 
                style={{ transform: 'translateZ(5px)' }}
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Headline Container (Overlaps the Glass Orb with overflow-hidden mask) */}
        <div className="w-full overflow-hidden text-center z-10 relative py-2 -my-2">
          <FadeIn delay={0.15} y={120} duration={1.3} className="w-full">
            <h1 className="hero-heading font-black uppercase tracking-tight leading-none w-full text-[9vw] sm:text-[8.5vw] md:text-[8vw] lg:text-[7.8vw] mt-6 sm:mt-4 md:-mt-5">
              Hi, we&apos;re Delhi Doors
            </h1>
          </FadeIn>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="w-full px-6 md:px-10 pb-7 sm:pb-8 md:pb-10 flex justify-between items-end z-20">
        <FadeIn delay={0.45} y={40} duration={1.0}>
          <p className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug text-[clamp(0.75rem,1.4vw,1.5rem)] max-w-[160px] sm:max-w-[220px] md:max-w-[260px]">
            a digital agency helping local businesses get more customers through websites and online presence
          </p>
        </FadeIn>
        <FadeIn delay={0.65} y={30} duration={1.0}>
          <ContactButton
            onClick={onBookConsultation}
          />
        </FadeIn>
      </div>
    </section>
  );
};

export default HeroSection;
