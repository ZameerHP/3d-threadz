import { useState, useEffect, useRef } from "react";
import { STORIES } from "../types";
import { motion } from "motion/react";

function ScrambledTitle({ text }: { text: string }) {
  const [displayText, setDisplayText] = useState(text);
  const [triggered, setTriggered] = useState(false);
  const elementRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    let interval: any;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered) {
          setTriggered(true);
          let iterations = 0;
          const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ_0123456789";
          interval = setInterval(() => {
            setDisplayText(
              text
                .split("")
                .map((char, index) => {
                  if (char === " ") return " ";
                  if (index < iterations) return text[index];
                  return chars[Math.floor(Math.random() * chars.length)];
                })
                .join("")
            );
            iterations += 0.5;
            if (iterations >= text.length + 1) {
              clearInterval(interval);
              setDisplayText(text);
            }
          }, 20);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
      if (interval) clearInterval(interval);
    };
  }, [text, triggered]);

  return (
    <h3 ref={elementRef} className="font-display font-bold text-2xl md:text-3xl lg:text-4xl text-white leading-tight uppercase">
      {displayText}
    </h3>
  );
}

export default function Storytelling() {
  const [loadedStories, setLoadedStories] = useState<Record<string, boolean>>({});
  return (
    <section id="our-story" className="py-24 bg-graphite-black border-b border-neutral-900 scroll-mt-20 relative overflow-hidden">
      {/* Shared vignette blend top & bottom to remove hard cuts */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent pointer-events-none z-10" />
      {/* Subtle Grid overlay background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#16161c_1px,transparent_1px),linear-gradient(to_bottom,#16161c_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-24 md:space-y-36 relative z-10">
        
        {STORIES.map((story, index) => {
          const isEven = index % 2 === 0;

          return (
            <motion.div
              key={story.title}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center relative ${
                isEven ? "" : "lg:flex-row-reverse"
              }`}
            >
              {/* Futuristic ambient glow */}
              <div className={`absolute top-1/2 ${isEven ? 'left-1/4' : 'right-1/4'} -translate-y-1/2 w-72 h-72 bg-white/5 rounded-full blur-[100px] pointer-events-none z-0`} />

              {/* Text Module */}
              <motion.div 
                initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className={`lg:col-span-6 flex flex-col space-y-6 relative z-10 ${
                  isEven ? "lg:order-1" : "lg:order-2"
                }`}
              >
                <div className="inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full" />
                  <p className="font-mono text-[9px] md:text-[10px] text-neutral-400 tracking-[0.3em] uppercase">
                    {story.subtitle}
                  </p>
                </div>
                
                <ScrambledTitle text={story.title} />
                
                <p className="font-sans font-light text-sm md:text-base text-neutral-400 leading-relaxed max-w-xl">
                  {story.text}
                </p>
              </motion.div>

              {/* Graphic/Image Module */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, x: isEven ? 40 : -40 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className={`lg:col-span-6 relative w-full aspect-video sm:aspect-[4/3] max-h-[450px] bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-900 group cursor-pointer ${
                  isEven ? "lg:order-2" : "lg:order-1"
                }`}
              >
                {/* Skeleton loader */}
                {!loadedStories[story.title] && (
                  <div className="absolute inset-0 bg-neutral-900/50 animate-pulse flex items-center justify-center z-[5]">
                    <div className="w-6 h-6 rounded-full border-2 border-neutral-800 border-t-white/40 animate-spin" />
                  </div>
                )}
                <img
                  src={story.image}
                  alt={story.title}
                  loading="lazy"
                  onLoad={() => setLoadedStories((prev) => ({ ...prev, [story.title]: true }))}
                  className={`w-full h-full object-cover scale-[1.01] grayscale group-hover:scale-[1.04] group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-[1s] ${
                    loadedStories[story.title] ? "opacity-80" : "opacity-0"
                  }`}
                  referrerPolicy="no-referrer"
                />


                
                {/* Accent corner borders to give modular grid aesthetic */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-neutral-700 group-hover:border-white group-hover:scale-105 transition-all duration-300" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-neutral-700 group-hover:border-white group-hover:scale-105 transition-all duration-300" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-neutral-700 group-hover:border-white group-hover:scale-105 transition-all duration-300" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-neutral-700 group-hover:border-white group-hover:scale-105 transition-all duration-300" />
              </motion.div>
            </motion.div>
          );
        })}

      </div>
    </section>
  );
}
