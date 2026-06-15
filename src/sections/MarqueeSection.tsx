import { useRef, useState, useEffect } from 'react';

const ROW1_IMAGES = [
  'https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif',
  'https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif',
  'https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif',
  'https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif',
  'https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif',
  'https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif',
  'https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif',
  'https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif',
  'https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif',
  'https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif'
];

const ROW2_IMAGES = [
  'https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif',
  'https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif',
  'https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif',
  'https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif',
  'https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif',
  'https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif',
  'https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif',
  'https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif',
  'https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif',
  'https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif'
];

export const MarqueeSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      // Calculate section top relative to document body
      const sectionTop = rect.top + window.scrollY;
      const currentOffset = (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      setOffset(currentOffset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial calculation
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Triple the images to allow seamless infinite scroll layout
  const row1Tripled = [...ROW1_IMAGES, ...ROW1_IMAGES, ...ROW1_IMAGES];
  const row2Tripled = [...ROW2_IMAGES, ...ROW2_IMAGES, ...ROW2_IMAGES];

  return (
    <section
      ref={sectionRef}
      className="bg-[#0C0C0C] pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden flex flex-col gap-3"
    >
      {/* Row 1 - Moves RIGHT (translateX(offset - 200)) */}
      <div className="w-full overflow-hidden select-none">
        <div
          className="flex gap-3 w-max transition-transform duration-75 ease-out"
          style={{
            transform: `translate3d(calc(-33.333% + ${offset - 200}px), 0, 0)`,
            willChange: 'transform',
          }}
        >
          {row1Tripled.map((url, index) => (
            <div
              key={`row1-${index}`}
              className="w-[420px] h-[270px] shrink-0"
            >
              <img
                src={url}
                alt={`Delhi Doors Showcase Row 1 - ${index}`}
                className="w-full h-full object-cover rounded-2xl pointer-events-none"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 - Moves LEFT (translateX(-(offset - 200))) */}
      <div className="w-full overflow-hidden select-none">
        <div
          className="flex gap-3 w-max transition-transform duration-75 ease-out"
          style={{
            transform: `translate3d(calc(-33.333% - ${offset - 200}px), 0, 0)`,
            willChange: 'transform',
          }}
        >
          {row2Tripled.map((url, index) => (
            <div
              key={`row2-${index}`}
              className="w-[420px] h-[270px] shrink-0"
            >
              <img
                src={url}
                alt={`Delhi Doors Showcase Row 2 - ${index}`}
                className="w-full h-full object-cover rounded-2xl pointer-events-none"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MarqueeSection;
