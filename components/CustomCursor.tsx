import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('button, a, .clickable')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-white pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          x: mousePosition.x - 8,
          y: mousePosition.y - 8,
          scale: isHovering ? 4 : 1,
          opacity: 1
        }}
        transition={{
          type: "tween",
          ease: "linear",
          duration: 0.1
        }}
      />
      {/* Crosshair lines decoration */}
      <motion.div 
         className="fixed pointer-events-none z-[9998] border border-white/20"
         animate={{
            x: mousePosition.x - 20,
            y: mousePosition.y - 20,
            width: 40,
            height: 40,
            opacity: isHovering ? 1 : 0
         }}
      />
    </>
  );
};