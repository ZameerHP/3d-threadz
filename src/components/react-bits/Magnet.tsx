import React, { useState, useRef, useEffect } from "react";

interface MagnetProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
  disabled?: boolean;
}

export default function Magnet({ children, strength = 0.2, className = "", disabled = false }: MagnetProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const x = e.clientX - centerX;
      const y = e.clientY - centerY;
      
      const distance = Math.sqrt(x * x + y * y);
      const maxDistance = 100; // Active boundary distance for magnet pull
      
      if (distance < maxDistance) {
        // Apply magnetic pull
        setPosition({ x: x * strength, y: y * strength });
      } else {
        // Reset to original position
        setPosition({ x: 0, y: 0 });
      }
    };

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 });
    };

    const element = ref.current;
    window.addEventListener("mousemove", handleMouseMove);
    if (element) {
      element.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (element) {
        element.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [strength, disabled]);

  const { x, y } = position;

  return (
    <div
      ref={ref}
      className={`inline-block transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${className}`}
      style={{
        transform: disabled ? "none" : `translate3d(${x}px, ${y}px, 0)`,
      }}
    >
      {children}
    </div>
  );
}
