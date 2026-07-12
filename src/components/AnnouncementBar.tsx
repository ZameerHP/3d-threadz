import { useState } from "react";
import { X, Flame } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="relative bg-neutral-900 border-b border-neutral-800 text-xs text-neutral-300 z-50 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex-1 flex items-center justify-center gap-6 overflow-hidden">
            <div className="flex items-center gap-2 font-mono tracking-widest text-[10px] md:text-xs">
              <Flame className="w-3.5 h-3.5 text-zinc-400 animate-pulse" />
              <span>3D THREADZ STREETWEAR DROP OUT NOW</span>
              <span className="hidden md:inline text-neutral-600">|</span>
              <span className="hidden md:inline text-neutral-400">FREE NATIONWIDE DELIVERY ALL OVER PAKISTAN ON ORDERS OVER ₨4,999</span>
              <span className="hidden md:inline text-neutral-600">|</span>
              <span className="hidden md:inline text-neutral-200 font-bold">CODE: METAL20 FOR 20% OFF</span>
            </div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 text-neutral-400 hover:text-white transition-colors focus-visible:outline-white rounded"
            aria-label="Dismiss announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
