import { useEffect, useState, useRef } from "react";

export default function CustomCursor() {
  const [hidden, setHidden] = useState(true);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const trailPos = useRef({ x: 0, y: 0 });
  const isClicked = useRef(false);
  const isHovered = useRef(false);

  useEffect(() => {
    // Hide cursor on touch devices
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    setHidden(false);

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX - 4}px, ${e.clientY - 4}px, 0) scale(${
          isClicked.current ? 0.8 : isHovered.current ? 1.5 : 1
        })`;
      }
    };

    const onMouseDown = () => {
      isClicked.current = true;
      updateCursorStyles();
    };

    const onMouseUp = () => {
      isClicked.current = false;
      updateCursorStyles();
    };

    // Use event delegation for hover elements to avoid memory leaks and DOM queries
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      
      const isInteractive = target.closest("a, button, [role='button'], .cursor-pointer, input, select, textarea");
      if (isInteractive) {
        isHovered.current = true;
        updateCursorStyles();
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      
      const isInteractive = target.closest("a, button, [role='button'], .cursor-pointer, input, select, textarea");
      if (isInteractive) {
        isHovered.current = false;
        updateCursorStyles();
      }
    };

    const updateCursorStyles = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x - 4}px, ${mousePos.current.y - 4}px, 0) scale(${
          isClicked.current ? 0.8 : isHovered.current ? 1.5 : 1
        })`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${trailPos.current.x - 16}px, ${trailPos.current.y - 16}px, 0) scale(${
          isClicked.current ? 0.85 : isHovered.current ? 1.6 : 1
        })`;
        ringRef.current.style.backgroundColor = isHovered.current ? "rgba(255, 255, 255, 0.05)" : "transparent";
        ringRef.current.style.borderColor = isHovered.current ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.3)";
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);

    // Smooth lerp trail animation running on requestAnimationFrame
    let animationFrameId: number;
    const updateTrail = () => {
      const ease = 0.15;
      const dx = mousePos.current.x - trailPos.current.x;
      const dy = mousePos.current.y - trailPos.current.y;
      
      trailPos.current.x += dx * ease;
      trailPos.current.y += dy * ease;
      
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${trailPos.current.x - 16}px, ${trailPos.current.y - 16}px, 0) scale(${
          isClicked.current ? 0.85 : isHovered.current ? 1.6 : 1
        })`;
      }
      animationFrameId = requestAnimationFrame(updateTrail);
    };
    
    animationFrameId = requestAnimationFrame(updateTrail);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (hidden) return null;

  return (
    <>
      <style>{`
        @media (pointer: fine) {
          body, a, button, [role='button'], .cursor-pointer {
            cursor: none !important;
          }
        }
      `}</style>

      {/* Main Cursor Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference will-change-transform"
        style={{ transform: "translate3d(-20px, -20px, 0)" }}
      />

      {/* Outer Follower Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 border border-white/30 rounded-full pointer-events-none z-[9999] transition-colors duration-300 will-change-transform"
        style={{ transform: "translate3d(-40px, -40px, 0)" }}
      />
    </>
  );
}
