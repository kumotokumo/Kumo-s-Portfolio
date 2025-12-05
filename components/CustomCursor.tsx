import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect if device supports touch
    const checkTouchDevice = () => {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    };
    
    setIsTouchDevice(checkTouchDevice());
    
    // Don't initialize cursor on touch devices
    if (checkTouchDevice()) {
      return;
    }

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

  // Don't render cursor on touch devices
  if (isTouchDevice) {
    return null;
  }

  return (
    <motion.div
      className="fixed top-0 left-0 w-4 h-4 bg-white pointer-events-none z-[9999] mix-blend-difference"
      animate={{
        x: mousePosition.x - 8,
        y: mousePosition.y - 8,
        scale: isHovering ? 1.5 : 1,
        opacity: isHovering ? 0.9 : 1
      }}
      transition={{
        x: { type: "tween", ease: "linear", duration: 0 },
        y: { type: "tween", ease: "linear", duration: 0 },
        scale: { type: "tween", ease: [0.25, 0.1, 0.25, 1], duration: 0.15 },
        opacity: { type: "tween", ease: [0.25, 0.1, 0.25, 1], duration: 0.15 }
      }}
    />
  );
};