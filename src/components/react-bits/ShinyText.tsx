import React from "react";

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

export default function ShinyText({ text, disabled = false, speed = 5, className = "" }: ShinyTextProps) {
  const animationDuration = `${speed}s`;

  return (
    <span
      className={`inline-block ${disabled ? "" : "animate-shiny-text"} ${className}`}
      style={{
        animationDuration: disabled ? "0s" : animationDuration,
        backgroundImage: "linear-gradient(120deg, rgba(200,200,200,0.3) 30%, rgba(255,255,255,1) 50%, rgba(200,200,200,0.3) 70%)",
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {text}
    </span>
  );
}
