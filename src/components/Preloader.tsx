import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    // Elegant, smooth progress loader incrementing
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => onCompleteRef.current(), 600); // Release to main content
          }, 450);
          return 100;
        }
        // Smoothly taper off progress near completion to look refined
        const increment = prev > 80 ? 1 : 1.8;
        return prev + increment;
      });
    }, 20);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
          className="fixed inset-0 bg-[#0B0B0D] z-[99999] flex flex-col items-center justify-center p-6 select-none overflow-hidden"
        >
          {/* Main loader logo and text container */}
          <div className="w-full max-w-sm flex flex-col items-center text-center space-y-12">
            
            {/* Elegant Logo Zoom */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="w-24 h-24 rounded-full overflow-hidden border border-neutral-900 p-0.5 shadow-2xl flex items-center justify-center bg-black">
                <img 
                  src="/logo.jpeg" 
                  alt="3D THREADZ Logo"
                  className="w-[90%] h-[90%] object-cover rounded-full"
                />
              </div>
            </motion.div>

            {/* Premium Clothing Brand Typography */}
            <div className="space-y-3">
              <motion.h2 
                initial={{ letterSpacing: "0.2em", opacity: 0 }}
                animate={{ letterSpacing: "0.45em", opacity: 1 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="font-display font-medium text-2xl md:text-3xl text-white uppercase tracking-[0.45em] ml-[0.45em]"
              >
                3D THREADZ
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="font-mono text-[9px] text-neutral-400 tracking-[0.3em] uppercase"
              >
                EST. 2026 / LIMITED STREETWEAR
              </motion.p>
            </div>

            {/* Hairline progress loader & percentage counter */}
            <div className="w-48 space-y-4 pt-4">
              <div className="relative w-full h-[1.5px] bg-neutral-950 rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-white transition-all duration-75 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              <div className="min-h-[14px]">
                <p className="font-mono text-[9px] text-neutral-500 tracking-[0.35em] uppercase font-bold">
                  {Math.round(progress)}%
                </p>
              </div>
            </div>

          </div>

          {/* Minimalist footer detail on loader */}
          <div className="absolute bottom-10 left-0 right-0 text-center pointer-events-none opacity-20">
            <span className="font-mono text-[8px] text-neutral-500 tracking-[0.4em] uppercase">
              CRAFTED IN PAKISTAN
            </span>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
