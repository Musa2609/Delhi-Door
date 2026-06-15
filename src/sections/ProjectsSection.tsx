import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FadeIn } from '../components/FadeIn';
import { LiveProjectButton, ContactButton } from '../components/Buttons';

interface ProjectData {
  number: string;
  name: string;
  category: string;
  col1Image1: string;
  col1Image2: string;
  col2Image: string;
  description?: string;
  techStack?: string;
  status?: string;
  link?: string;
  buttonLabel?: string;
}

const PROJECTS_DATA: ProjectData[] = [
  {
    number: '01',
    name: 'Monolith',
    category: 'Client Project',
    description: 'Luxury Interior Design Website',
    techStack: 'Built with WordPress',
    status: 'Completed Client Project',
    link: 'https://monolith.42web.io/wp/',
    col1Image1: '/monolith-services.png',
    col1Image2: '/monolith-portfolio.png',
    col2Image: '/monolith-hero.png'
  },
  {
    number: '02',
    name: 'Escalation Risk Engine',
    category: 'Personal Project',
    description: 'An AI-powered behavioral risk analysis platform designed to detect escalation patterns before they occur. The system combines motion analytics, behavioral intelligence, proximity metrics, and decision-support models to generate real-time risk assessments and visual insights.',
    techStack: 'Python • Machine Learning • Analytics • React',
    status: 'Machine Learning / Analytics Platform',
    link: '#',
    buttonLabel: 'Personal Project',
    col1Image1: '/escalation-telemetry.png',
    col1Image2: '/escalation-math.png',
    col2Image: '/escalation-hero.png'
  },
  {
    number: '03',
    name: 'Aetheris',
    category: 'Client Project',
    description: 'Aetheris is an AI-powered music personality analysis platform that transforms listening behavior into psychological insights. The experience combines immersive visuals, mood intelligence, behavioral pattern recognition, and modern SaaS design to create a unique user journey.',
    techStack: 'React • TypeScript • AI Integration • UI/UX Design',
    status: 'Completed Client Project',
    link: '#',
    buttonLabel: 'Private Client Project',
    col1Image1: '/aetheris-decoding.png',
    col1Image2: '/aetheris-nocturnal.png',
    col2Image: '/aetheris-hero.png'
  }
];

interface StickyCardProps {
  project: ProjectData;
  index: number;
  totalCards: number;
}

const StickyCard: React.FC<StickyCardProps> = ({ project, index, totalCards }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const targetScale = 1 - (totalCards - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  return (
    <div
      ref={containerRef}
      className="sticky h-[80vh] md:h-[85vh] w-full [--sticky-top:6rem] md:[--sticky-top:8rem]"
      style={{
        top: `calc(var(--sticky-top) + ${index * 28}px)`,
        zIndex: index + 10,
      }}
    >
      {/* Outer wrapper: Handles smooth viewport entry scale/fade */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 50 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="w-full h-full"
      >
        {/* Inner wrapper: Handles scroll-past stack scaling */}
        <motion.div
          style={{
            scale,
            transformOrigin: 'top center',
          }}
          className="w-full h-full border-2 border-[#D7E2EA] bg-[#0C0C0C] rounded-[40px] sm:rounded-[50px] md:rounded-[60px] p-4 sm:p-6 md:p-8 flex flex-col justify-between"
        >
          {/* Top Row: Details & Button */}
          <div className="flex flex-row justify-between items-center w-full">
            <div className="flex items-center gap-4 sm:gap-6">
              <span className="font-black text-[#D7E2EA] text-[clamp(2.5rem,7vw,110px)] leading-none select-none">
                {project.number}
              </span>
              <div className="flex flex-col text-left justify-center max-w-[70%]">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] sm:text-xs text-[#D7E2EA] opacity-60 uppercase tracking-widest leading-none">
                    {project.category}
                  </span>
                  {project.status && (
                    <span className="px-2 py-0.5 rounded text-[8px] sm:text-[9px] text-[#D7E2EA]/80 border border-[#D7E2EA]/20 bg-[#D7E2EA]/5 uppercase tracking-widest leading-none">
                      {project.status}
                    </span>
                  )}
                </div>
                <h3 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-medium text-[#D7E2EA] uppercase leading-tight mt-1">
                  {project.name}
                </h3>
                {project.description && (
                  <p className="text-xs sm:text-sm text-[#D7E2EA] opacity-80 mt-1 font-light max-w-xl">
                    {project.description}
                  </p>
                )}
                {project.techStack && (
                  <p className="text-[10px] sm:text-xs text-[#D7E2EA] opacity-50 mt-0.5 font-light">
                    {project.techStack}
                  </p>
                )}
              </div>
            </div>
            {project.link && project.link !== '#' ? (
              <LiveProjectButton
                label={project.buttonLabel || "Live Project"}
                className="shrink-0 scale-90 sm:scale-100"
                onClick={() => {
                  window.open(project.link, '_blank', 'noopener,noreferrer');
                }}
              />
            ) : (
              <div
                className="rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest select-none
                  px-8 py-3 sm:px-10 sm:py-3.5 text-xs sm:text-sm md:text-base shrink-0 scale-90 sm:scale-100 cursor-default"
              >
                {project.buttonLabel || "Personal Project"}
              </div>
            )}
          </div>

          {/* Bottom Row: Image Grid (40% vs 60%) */}
          <div className="flex flex-row gap-3 sm:gap-6 md:gap-8 w-full items-stretch flex-grow mt-4 sm:mt-6 md:mt-8 overflow-hidden">
            {/* Left Column (40%) - Detail Images */}
            <div className="w-[40%] flex flex-col gap-3 sm:gap-6 md:gap-8 justify-between">
              {/* Detail Image 1 */}
              <div 
                className="overflow-hidden rounded-[20px] sm:rounded-[30px] md:rounded-[40px] lg:rounded-[50px] w-full"
                style={{ height: 'clamp(110px, 16vw, 230px)' }}
              >
                <motion.img
                  initial={{ opacity: 0, scale: 1.08 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
                  src={project.col1Image1}
                  alt={`${project.name} Detail 1`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Detail Image 2 */}
              <div 
                className="overflow-hidden rounded-[20px] sm:rounded-[30px] md:rounded-[40px] lg:rounded-[50px] w-full flex-grow"
                style={{ height: 'clamp(140px, 22vw, 340px)' }}
              >
                <motion.img
                  initial={{ opacity: 0, scale: 1.08 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
                  src={project.col1Image2}
                  alt={`${project.name} Detail 2`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Right Column (60%) - Hero Image */}
            <div className="w-[60%] h-full overflow-hidden rounded-[20px] sm:rounded-[30px] md:rounded-[40px] lg:rounded-[50px]">
              <motion.img
                initial={{ opacity: 0, scale: 1.08 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                src={project.col2Image}
                alt={`${project.name} Main Showcase`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

interface ProjectsSectionProps {
  onBookConsultation: () => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ onBookConsultation }) => {
  return (
    <section
      id="projects"
      className="relative bg-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 z-20 px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 select-none"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {/* Section Heading */}
        <FadeIn delay={0} y={40} className="w-full text-center mb-12 sm:mb-16">
          <h2 className="hero-heading font-black uppercase tracking-tight leading-none text-[clamp(3rem,12vw,160px)]">
            Project
          </h2>
        </FadeIn>

        {/* Cards Stack Container */}
        <div className="flex flex-col gap-24 md:gap-32 pb-24 max-w-5xl mx-auto w-full">
          {PROJECTS_DATA.map((project, index) => (
            <StickyCard
              key={project.number}
              project={project}
              index={index}
              totalCards={PROJECTS_DATA.length}
            />
          ))}
        </div>

        {/* Footer Area with id="contact" */}
        <div id="contact" className="mt-20 pt-20 border-t border-[#D7E2EA]/10 flex flex-col items-center text-center max-w-5xl mx-auto w-full">
          <FadeIn delay={0} y={30}>
            <h3 className="hero-heading font-black uppercase tracking-tight text-[clamp(2.5rem,8vw,90px)] leading-none mb-6">
              Let&apos;s Grow Together
            </h3>
          </FadeIn>
          <FadeIn delay={0.1} y={20}>
            <p className="text-[#D7E2EA] font-light max-w-md mx-auto text-sm sm:text-base opacity-75 mb-8 uppercase tracking-wider">
              Ready to scale your business? Get in touch with Delhi Doors today and start attracting more customers.
            </p>
          </FadeIn>
          <FadeIn delay={0.2} y={20} className="mb-16">
            <ContactButton onClick={onBookConsultation} />
          </FadeIn>
          <div className="w-full flex flex-col sm:flex-row justify-between items-center text-[#D7E2EA]/50 text-xs sm:text-sm uppercase tracking-widest pt-8 border-t border-[#D7E2EA]/5">
            <span>© {new Date().getFullYear()} Delhi Doors. All rights reserved.</span>
            <span className="mt-2 sm:mt-0">Digital Growth Agency</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
