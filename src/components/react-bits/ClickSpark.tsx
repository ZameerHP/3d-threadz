import React, { useEffect, useState, useRef } from "react";

interface Spark {
  id: number;
  x: number;
  y: number;
  color: string;
  angle: number;
  velocity: number;
  size: number;
}

export default function ClickSpark({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const [sparks, setSparks] = useState<Spark[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const sparkIdCounter = useRef(0);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const newSparks: Spark[] = [];
    const count = 12;
    const colors = ["#FFFFFF", "#9CA3AF", "#E5E7EB", "#D1D5DB"];
    
    for (let i = 0; i < count; i++) {
      newSparks.push({
        id: sparkIdCounter.current++,
        x: clickX,
        y: clickY,
        color: colors[Math.floor(Math.random() * colors.length)],
        angle: Math.random() * Math.PI * 2,
        velocity: 3 + Math.random() * 4,
        size: 3 + Math.random() * 2,
      });
    }

    setSparks((prev) => [...prev, ...newSparks]);
  };

  useEffect(() => {
    if (sparks.length === 0) return;

    const timer = requestAnimationFrame(() => {
      setSparks((prevSparks) =>
        prevSparks
          .map((spark) => ({
            ...spark,
            x: spark.x + Math.cos(spark.angle) * spark.velocity,
            y: spark.y + Math.sin(spark.angle) * spark.velocity,
            velocity: spark.velocity * 0.9, // deceleration
            size: spark.size - 0.1,
          }))
          .filter((spark) => spark.size > 0.2)
      );
    });

    return () => cancelAnimationFrame(timer);
  }, [sparks]);

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className={`relative inline-block ${className}`}
    >
      {children}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-50">
        {sparks.map((spark) => (
          <circle
            key={spark.id}
            cx={spark.x}
            cy={spark.y}
            r={spark.size}
            fill={spark.color}
            opacity={spark.size / 5}
          />
        ))}
      </svg>
    </div>
  );
}
