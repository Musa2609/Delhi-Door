import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
}

interface CharacterProps {
  char: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}

const AnimatedCharacter: React.FC<CharacterProps> = ({ char, index, total, progress }) => {
  // Sequentially distribute the fade-in across scroll progress
  // Overlap characters so they fade in smoothly together
  const start = index / total;
  const end = Math.min(1, start + 0.08); // Overlap duration
  
  const opacity = useTransform(progress, [start, end], [0.2, 1]);

  return (
    <span className="relative inline-block">
      {/* Invisible placeholder to reserve layout space */}
      <span className="opacity-0 select-none pointer-events-none">{char}</span>
      {/* Absolute positioned animated character */}
      <motion.span style={{ opacity }} className="absolute left-0 top-0">
        {char}
      </motion.span>
    </span>
  );
};

export const AnimatedText: React.FC<AnimatedTextProps> = ({ text, className = '' }) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2']
  });

  // Split by words first, then by characters, to prevent words from breaking mid-line
  const words = text.split(' ');
  let charCounter = 0;
  
  // First, calculate total characters across all words (excluding spaces, or including them)
  const totalChars = text.length;

  return (
    <p ref={containerRef} className={className}>
      {words.map((word, wordIdx) => {
        const wordChars = word.split('');
        
        return (
          <span key={wordIdx} className="inline-block whitespace-nowrap">
            {wordChars.map((char) => {
              const currentCharIndex = charCounter++;
              return (
                <AnimatedCharacter
                  key={currentCharIndex}
                  char={char}
                  index={currentCharIndex}
                  total={totalChars}
                  progress={scrollYProgress}
                />
              );
            })}
            {/* Add space between words, which also fades in */}
            {wordIdx < words.length - 1 && (
              <AnimatedCharacter
                char={String.fromCharCode(160)}
                index={charCounter++}
                total={totalChars}
                progress={scrollYProgress}
              />
            )}
          </span>
        );
      })}
    </p>
  );
};

export default AnimatedText;
