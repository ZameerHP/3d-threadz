import { useState, useRef, MouseEvent, TouchEvent, ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";

interface LensProps {
  children: ReactNode;
  zoomFactor?: number;
  lensSize?: number;
  isActive?: boolean;
  imageUrl?: string;
}

export function Lens({ children, zoomFactor = 2, lensSize = 180, isActive = true, imageUrl: directImageUrl }: LensProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isActive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Constraint position inside container limits if necessary, but standard Lens centers at cursor
    setPosition({ x, y });
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!isActive || !containerRef.current || e.touches.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    setPosition({ x, y });
  };

  // Calculate the percentage position for background offset
  const getBackgroundPosition = () => {
    if (!containerRef.current) return "0% 0%";
    const rect = containerRef.current.getBoundingClientRect();
    
    // Percentage position across the image width/height
    const xPercent = (position.x / rect.width) * 100;
    const yPercent = (position.y / rect.height) * 100;
    
    return `${xPercent}% ${yPercent}%`;
  };

  // Find the image URL from child elements to use as background for magnifier lens
  let imageUrl = directImageUrl || "";
  if (!imageUrl && children) {
    const findSrc = (node: any): string => {
      if (!node) return "";
      if (node.props && node.props.src) return node.props.src;
      if (node.props && node.props.children) {
        if (Array.isArray(node.props.children)) {
          for (const child of node.props.children) {
            const src = findSrc(child);
            if (src) return src;
          }
        } else {
          return findSrc(node.props.children);
        }
      }
      return "";
    };

    if (Array.isArray(children)) {
      for (const child of children) {
        imageUrl = findSrc(child);
        if (imageUrl) break;
      }
    } else {
      imageUrl = findSrc(children);
    }
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseEnter={() => isActive && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => isActive && setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
      className="relative overflow-hidden w-full h-full cursor-crosshair select-none rounded"
    >
      {/* Underlying Image */}
      {children}

      {/* Magnifying Lens */}
      <AnimatePresence>
        {isHovered && isActive && imageUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="absolute pointer-events-none rounded-full border-2 border-neutral-400 bg-neutral-950 shadow-[0_0_25px_rgba(0,0,0,0.8),inset_0_0_15px_rgba(255,255,255,0.2)]"
            style={{
              width: lensSize,
              height: lensSize,
              left: position.x - lensSize / 2,
              top: position.y - lensSize / 2,
              backgroundImage: `url(${imageUrl})`,
              backgroundPosition: getBackgroundPosition(),
              backgroundRepeat: "no-repeat",
              backgroundSize: `${100 * zoomFactor}% ${100 * zoomFactor}%`,
              zIndex: 30,
            }}
          >
            {/* Elegant metallic ring sheen overlay */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
            
            {/* Subtle center aiming reticle */}
            <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none">
              <div className="w-4 h-[1px] bg-white" />
              <div className="h-4 w-[1px] bg-white" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
