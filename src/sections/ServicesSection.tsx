import React from 'react';
import { motion } from 'framer-motion';
import { FadeIn } from '../components/FadeIn';

interface ServiceItem {
  number: string;
  name: string;
  description: string;
}

const SERVICES_DATA: ServiceItem[] = [
  {
    number: '01',
    name: 'Business websites',
    description: 'Professional websites designed to showcase your business, build trust, and convert visitors into customers.'
  },
  {
    number: '02',
    name: 'Website Redesign',
    description: 'Transform outdated websites into modern, mobile-friendly experiences that improve credibility and user engagement.'
  },
  {
    number: '03',
    name: 'Google Business Profile',
    description: 'Optimize your Google Business Profile to improve local visibility, customer trust, and lead generation.'
  },
  {
    number: '04',
    name: 'Landing pages',
    description: 'High-converting landing pages built for promotions, lead generation, bookings, and advertising campaigns.'
  },
  {
    number: '05',
    name: 'Website Maintenance',
    description: 'Ongoing updates, security improvements, performance optimization, and technical support for business websites.'
  }
];

// Framer Motion Animation Variants for premium performance & interactive states
const itemVariants = {
  initial: { 
    opacity: 0, 
    y: 35,
    borderColor: "rgba(12, 12, 12, 0.12)"
  },
  view: (baseDelay: number) => ({
    opacity: 1,
    y: 0,
    borderColor: "rgba(12, 12, 12, 0.12)",
    transition: { 
      opacity: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const, delay: baseDelay },
      y: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const, delay: baseDelay },
      borderColor: { duration: 0.5 }
    }
  }),
  hover: {
    borderColor: "rgba(12, 12, 12, 0.35)",
    transition: { duration: 0.4, ease: "easeOut" as const }
  }
};

const bgNumberVariants = {
  initial: { opacity: 0, scale: 0.85, y: "-40%" },
  view: (baseDelay: number) => ({
    opacity: 0.05, // 5% starting opacity
    scale: 1,
    y: "-50%", // Keep perfectly centered vertically
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const, delay: baseDelay }
  }),
  hover: {
    scale: 1.08,
    opacity: 0.08, // Scales up to 8% opacity on hover
    y: "-50%",
    transition: { type: "spring" as const, stiffness: 150, damping: 18 }
  }
};

const numberVariants = {
  initial: { opacity: 0, y: 20 },
  view: (baseDelay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const, delay: baseDelay }
  }),
  hover: {
    scale: 1.06,
    transition: { type: "spring" as const, stiffness: 350, damping: 15 }
  }
};

const titleVariants = {
  initial: { opacity: 0, y: 15 },
  view: (baseDelay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const, delay: baseDelay + 0.12 } // Animates second
  }),
  hover: {
    x: 16,
    transition: { type: "spring" as const, stiffness: 220, damping: 16 }
  }
};

const descVariants = {
  initial: { opacity: 0, y: 15 },
  view: (baseDelay: number) => ({
    opacity: 0.6,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const, delay: baseDelay + 0.24 } // Animates third
  }),
  hover: {
    opacity: 1.0,
    transition: { duration: 0.35, ease: "easeOut" as const }
  }
};

const glowVariants = {
  initial: { opacity: 0 },
  hover: {
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" as const }
  }
};

const dividerVariants = {
  initial: { scaleX: 0 },
  view: {
    scaleX: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }
  },
  hover: {
    scaleX: 1,
    transition: { type: "spring" as const, stiffness: 100, damping: 15 }
  }
};

export const ServicesSection: React.FC = () => {
  return (
    <section
      id="services"
      className="bg-[#FFFFFF] text-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 select-none relative z-10"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <FadeIn delay={0} y={40}>
          <h2 className="font-black uppercase text-center text-[#0C0C0C] text-[clamp(3rem,12vw,160px)] leading-none mb-16 sm:mb-20 md:mb-28">
            Services
          </h2>
        </FadeIn>

        {/* Vertical List of Services */}
        <div className="max-w-5xl mx-auto flex flex-col">
          {SERVICES_DATA.map((service, index) => {
            const baseDelay = index * 0.15; // Stagger each list item slightly

            return (
              <motion.div
                key={service.number}
                initial="initial"
                whileInView="view"
                whileHover="hover"
                viewport={{ once: true, margin: "-85px" }}
                custom={baseDelay}
                variants={itemVariants}
                className={`relative flex flex-row items-center gap-6 sm:gap-10 md:gap-16 py-8 sm:py-10 md:py-12 border-b cursor-pointer overflow-hidden ${
                  index === 0 ? 'border-t' : ''
                }`}
                style={{
                  borderBottomColor: 'rgba(12, 12, 12, 0.12)',
                  borderTopColor: index === 0 ? 'rgba(12, 12, 12, 0.12)' : undefined,
                }}
              >
                {/* Subtle Gradient Glow (Extremely low opacity behind hovered service) */}
                <motion.div
                  variants={glowVariants}
                  className="absolute inset-0 bg-gradient-to-r from-[#7621B0]/4 via-[#B600A8]/2 to-transparent pointer-events-none z-0"
                />

                {/* Huge Background Number (Floating behind text) */}
                <motion.div
                  variants={bgNumberVariants}
                  className="absolute right-[8%] top-1/2 font-black text-black pointer-events-none select-none z-0 text-[12vw] sm:text-[14vw] md:text-[16vw] lg:text-[18vw] leading-none"
                  style={{ transformOrigin: 'right center' }}
                >
                  {service.number}
                </motion.div>

                {/* Left Side: Service Number */}
                <motion.div
                  variants={numberVariants}
                  className="font-black text-[#0C0C0C] text-[clamp(3rem,10vw,140px)] leading-none select-none shrink-0 min-w-[60px] sm:min-w-[100px] md:min-w-[140px] z-10"
                >
                  {service.number}
                </motion.div>

                {/* Right Side: Title & Description */}
                <div className="flex flex-col text-left z-10">
                  <motion.h3
                    variants={titleVariants}
                    className="font-medium uppercase text-[#0C0C0C] text-[clamp(1rem,2.2vw,2.1rem)] mb-2 leading-tight"
                  >
                    {service.name}
                  </motion.h3>
                  
                  <motion.p
                    variants={descVariants}
                    className="font-light leading-relaxed max-w-2xl text-[#0C0C0C] text-[clamp(0.85rem,1.6vw,1.25rem)]"
                  >
                    {service.description}
                  </motion.p>
                </div>

                {/* Animated Bottom Divider Line */}
                <motion.div
                  variants={dividerVariants}
                  style={{ transformOrigin: 'left' }}
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#7621B0] via-[#B600A8] to-[#BE4C00] z-20"
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
