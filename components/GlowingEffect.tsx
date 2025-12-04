import React, { useEffect, useRef, useState } from 'react';

interface GlowingEffectProps {
  children: React.ReactNode;
  className?: string;
  blur?: number;
  spread?: number;
  proximity?: number;
  inactiveZone?: number;
  variant?: 'default' | 'white';
  glow?: boolean;
  disabled?: boolean;
  movementDuration?: number;
  borderWidth?: number;
}

export const GlowingEffect: React.FC<GlowingEffectProps> = ({
  children,
  className = '',
  blur = 20,
  spread = 20,
  proximity = 0,
  inactiveZone = 0.7,
  variant = 'default',
  glow = false,
  disabled = false,
  movementDuration = 0.3,
  borderWidth = 1,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || disabled) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePosition({ x, y });

      if (glowRef.current) {
        glowRef.current.style.setProperty('--mouse-x', `${x}px`);
        glowRef.current.style.setProperty('--mouse-y', `${y}px`);
      }
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    const container = containerRef.current;
    if (container && !disabled) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [disabled]);

  const shouldShowGlow = glow || (isHovered && !disabled);
  const rect = containerRef.current?.getBoundingClientRect();
  const centerX = rect ? rect.width / 2 : 0;
  const centerY = rect ? rect.height / 2 : 0;
  
  const distance = Math.sqrt(
    Math.pow(mousePosition.x - centerX, 2) + Math.pow(mousePosition.y - centerY, 2)
  );
  const maxDistance = rect ? Math.sqrt(Math.pow(rect.width / 2, 2) + Math.pow(rect.height / 2, 2)) : 0;
  const normalizedDistance = maxDistance > 0 ? distance / maxDistance : 0;
  const isInInactiveZone = normalizedDistance < inactiveZone;

  const angle = Math.atan2(
    mousePosition.y - centerY,
    mousePosition.x - centerX
  ) * (180 / Math.PI);

  const gradientColors = variant === 'white' 
    ? 'rgba(255,255,255,0.3), rgba(0,0,0,0.1), rgba(255,255,255,0.3)'
    : 'rgba(59, 130, 246, 0.5), rgba(147, 51, 234, 0.5), rgba(236, 72, 153, 0.5)';

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
    >
      {children}
      {shouldShowGlow && !isInInactiveZone && (
        <div
          ref={glowRef}
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{
            background: `conic-gradient(from ${angle + 90}deg at ${mousePosition.x}px ${mousePosition.y}px, ${gradientColors})`,
            filter: `blur(${blur}px)`,
            opacity: 0.7,
            transition: `opacity ${movementDuration}s ease-out`,
            zIndex: 0,
            margin: `-${borderWidth}px`,
          }}
        />
      )}
    </div>
  );
};

