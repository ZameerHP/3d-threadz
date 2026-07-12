import { useEffect, useState, useRef, lazy, Suspense } from "react";
import { ArrowDown } from "lucide-react";
import { useCart } from "./CartContext";
import { motion, useScroll, useTransform } from "motion/react";
import LiquidChrome from "./react-bits/LiquidChrome";
import ShinyText from "./react-bits/ShinyText";
import Magnet from "./react-bits/Magnet";

const modelVideo = "/model-3d.webm";

export default function Hero() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const { setActiveFilter } = useCart();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  // Unified scroll transforms for two-layer parallax (Max movement 20px)
  const yVideo = useTransform(scrollY, [0, 500], [0, 20]);
  const yText = useTransform(scrollY, [0, 500], [0, -10]);
  const yShader = useTransform(scrollY, [0, 500], [0, 10]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", listener);
    // Trigger entrance animations
    const timer = setTimeout(() => setIsVisible(true), 150);
    return () => {
      mediaQuery.removeEventListener("change", listener);
      clearTimeout(timer);
    };
  }, []);

  // Guarantee video playback in iframe/sandboxed and mobile environments
  useEffect(() => {
    const videoObj = videoRef.current;
    if (!videoObj) return;
    videoObj.muted = true;
    videoObj.defaultMuted = true;
    try { videoObj.load(); } catch (e) { /* silent fail */ }

    let isPlaying = false;
    const playVideo = async () => {
      try { await videoObj.play(); isPlaying = true; } catch (err) {
        /* autoplay blocked */
      }
    };
    playVideo();

    const handleInteraction = () => {
      if (videoObj && !isPlaying) {
        videoObj.play().then(() => { isPlaying = true; cleanup(); }).catch(() => {});
      }
    };
    const cleanup = () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
      window.removeEventListener("scroll", handleInteraction);
    };
    window.addEventListener("click", handleInteraction, { passive: true });
    window.addEventListener("touchstart", handleInteraction, { passive: true });
    window.addEventListener("scroll", handleInteraction, { passive: true });
    return () => cleanup();
  }, []);

  const handleShopCollection = () => {
    setActiveFilter("ALL");
    scrollToShopSection();
  };

  const handleCustomizeTee = () => {
    setActiveFilter("Custom Printed T-Shirts");
    scrollToShopSection();
  };

  const scrollToShopSection = () => {
    const element = document.getElementById("shop-the-drop");
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <section 
      ref={containerRef}
      style={{ perspective: "700px" }}
      className="relative min-h-fit h-auto lg:h-screen flex flex-col lg:flex-row items-stretch justify-between overflow-visible lg:overflow-hidden bg-graphite-black z-10"
    >


      <motion.div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
        }}
        className="w-full h-full flex flex-col lg:flex-row items-stretch justify-between relative"
      >
        {/* WebGL Liquid Chrome Background covering the ENTIRE Hero section to maintain 1 color and no partition */}
        <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none opacity-30">
          <LiquidChrome />
        </div>

      {/* Cinematic Background Flying T-Shirts Video */}
      <div className="absolute top-0 left-0 right-0 h-screen lg:h-full z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-75"
          src="/tshirts-flying.mp4"
        />
        {/* Soft lighting overlay to blend and highlight the background video */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 50% 50%, transparent 40%, rgba(0, 0, 0, 0.35) 90%)'
          }}
        />
      </div>



      {/* Noise texture overlay */}
      <div className="absolute inset-0 z-[1] opacity-[0.02] pointer-events-none"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', backgroundSize: '128px 128px' }}
      />





      {/* ═══ LEFT COLUMN: Typography & CTAs ═══ */}
      <motion.div
        style={{ y: prefersReducedMotion ? 0 : yText }}
        className="w-full lg:w-1/2 flex flex-col justify-center items-start px-6 sm:px-12 md:px-16 lg:pl-28 lg:pr-16 pt-28 pb-12 lg:py-8 z-10 relative"
      >


        <div className="relative z-10 flex flex-col items-start space-y-6 md:space-y-7 w-full">

        {/* Futuristic Subtitle Tag */}
        <div
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-1"
          style={{
            transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
            opacity: isVisible ? 1 : 0,
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-[9px] text-neutral-300 tracking-[0.25em] uppercase font-bold">
            DROP 01 LIVE // LIMITED CAPSULE
          </span>
        </div>

        {/* Thin decorative line */}
        <div
          style={{
            transform: isVisible ? 'scaleX(1)' : 'scaleX(0)',
            opacity: isVisible ? 1 : 0,
            transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.15s',
            transformOrigin: 'left',
          }}
        >
          <div className="w-12 h-[1px] bg-gradient-to-r from-white/60 to-transparent" />
        </div>

        {/* Main Headline with shimmer effect */}
        <div
          style={{
            transform: isVisible ? 'translateY(0)' : 'translateY(-60px)',
            opacity: isVisible ? 1 : 0,
            transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.35s',
          }}
        >
          <h1 className="font-hero-funky font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] text-white leading-[1.02] tracking-tight max-w-xl uppercase">
            <ShinyText text="PREMIUM FASHION" speed={4} />
            <br />
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text italic font-bold"
                style={{
                  backgroundImage: 'linear-gradient(90deg, #d4d4d8, #ffffff, #a1a1aa, #ffffff, #d4d4d8)',
                  backgroundSize: '200% 100%',
                  animation: prefersReducedMotion ? 'none' : 'shimmerText 4s linear infinite',
                }}
              >
                For The Next
              </span>
            </span>
            <br />
            <span className="relative">
              <span className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: 'linear-gradient(90deg, #e4e4e7, #ffffff, #e4e4e7)',
                  backgroundSize: '200% 100%',
                  animation: prefersReducedMotion ? 'none' : 'shimmerText 4s linear infinite 0.5s',
                }}
              >
                Generation.
              </span>
              {/* Underline accent */}
              <span className="absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent"
                style={{
                  width: isVisible ? '100%' : '0%',
                  transition: 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1) 1s',
                }}
              />
            </span>
          </h1>
        </div>

        {/* Subheading with stagger */}
        <div
          style={{
            transform: isVisible ? 'translateY(0)' : 'translateY(-50px)',
            opacity: isVisible ? 1 : 0,
            transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.55s',
          }}
        >
          <p className="font-sans font-light text-sm md:text-[15px] text-neutral-400 tracking-wide max-w-md leading-relaxed">
            Premium oversized tees, graphic prints & custom apparel — crafted for those who demand more.
          </p>
        </div>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto"
          style={{
            transform: isVisible ? 'translateY(0)' : 'translateY(-40px)',
            opacity: isVisible ? 1 : 0,
            transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.7s',
          }}
        >
          {/* Primary CTA — Animated gradient border */}
          <Magnet strength={0.15}>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleShopCollection}
              className="group relative overflow-hidden rounded-full p-[1.5px] focus-visible:outline-white cursor-pointer"
              style={{
                background: 'linear-gradient(90deg, #404040, #e5e5e5, #404040, #e5e5e5, #404040)',
                backgroundSize: '300% 100%',
                animation: prefersReducedMotion ? 'none' : 'borderGlow 4s linear infinite',
              }}
            >
              <span className="relative flex items-center justify-center gap-2.5 bg-[#0a0a0c] group-hover:bg-[#111114] text-white font-mono text-[11px] font-bold tracking-[0.25em] uppercase px-8 py-4 rounded-full transition-all duration-500">
                Shop Collection
                <ArrowDown className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
              </span>
            </motion.button>
          </Magnet>

          <Magnet strength={0.15}>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleCustomizeTee}
              className="group relative px-8 py-4 rounded-full font-mono text-[11px] font-bold tracking-[0.25em] text-neutral-100 hover:text-black uppercase transition-all duration-500 text-center focus-visible:outline-neutral-500 overflow-hidden border border-white/20 hover:border-white hover:bg-white cursor-pointer"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(8px)',
              }}
            >
              Customize Tee
            </motion.button>
          </Magnet>
        </div>

        {/* Stats bar with glassmorphism */}
        <div
          className="grid grid-cols-3 gap-0 w-full max-w-sm rounded-xl overflow-hidden border border-neutral-800/40"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.005) 100%)',
            backdropFilter: 'blur(12px)',
            transform: isVisible ? 'translateY(0)' : 'translateY(-35px)',
            opacity: isVisible ? 1 : 0,
            transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.9s',
          }}
        >
          {[
            { label: "FABRIC", value: "280-300 GSM" },
            { label: "CRAFTED IN", value: "PAKISTAN" },
            { label: "FIT", value: "BOXY COMFORT" },
          ].map((stat, i) => (
            <div key={stat.label} className={`px-4 py-3.5 ${i < 2 ? 'border-r border-neutral-800/40' : ''}`}>
              <p className="font-mono text-[8px] md:text-[9px] text-neutral-500 tracking-[0.2em] uppercase mb-1">
                {stat.label}
              </p>
              <p className="font-display font-bold text-[10px] md:text-xs text-neutral-200 tracking-widest uppercase">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>

      {/* ═══ RIGHT COLUMN: 3D Model Video ═══ */}
      <motion.div
        className="w-full lg:w-1/2 relative h-[55vh] sm:h-[60vh] lg:h-auto overflow-hidden z-20 group flex items-center justify-center"
        style={{
          transform: isVisible ? 'translateY(0)' : 'translateY(-80px)',
          opacity: isVisible ? 1 : 0,
          transition: 'transform 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.5s, opacity 1.5s ease-out 0.5s',
          y: prefersReducedMotion ? 0 : yVideo,
        }}
      >
        {/* Skeleton for the video while loading on slow connections */}
        {!isVideoLoaded && (
          <div className="absolute inset-0 z-[5] flex items-center justify-center pointer-events-none">
            <div className="w-[75%] h-[75%] rounded-full bg-neutral-950/20 border border-neutral-900/40 flex items-center justify-center shadow-[0_0_80px_20px_rgba(255,255,255,0.015)] animate-pulse">
              <div className="w-[70%] h-[70%] rounded-full border border-neutral-800/30 flex items-center justify-center">
                <div className="w-[50%] h-[50%] rounded-full border border-neutral-800/10" />
              </div>
            </div>
          </div>
        )}

        {/* THE VIDEO: Centered 3D model with removed background */}
        <video
          ref={videoRef}
          src={modelVideo}
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setIsVideoLoaded(true)}
          className="relative z-[10] w-[85%] h-[85%] lg:w-[90%] lg:h-[90%] max-h-[60vh] lg:max-h-[70vh] object-contain object-center"
          style={{
            transform: isVideoLoaded ? 'scale(0.98)' : 'scale(0.88)',
            opacity: isVideoLoaded ? 1 : 0,
            transition: 'transform 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 1.5s ease-out, opacity 1s ease-out',
            filter: 'brightness(1.0) contrast(1.1) saturate(1.05)',
          }}
          onMouseEnter={(e) => {
            if (!prefersReducedMotion && isVideoLoaded) {
              e.currentTarget.style.transform = 'scale(1.03)';
              e.currentTarget.style.filter = 'brightness(1.05) contrast(1.15) saturate(1.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (isVideoLoaded) {
              e.currentTarget.style.transform = 'scale(0.98)';
              e.currentTarget.style.filter = 'brightness(1.0) contrast(1.1) saturate(1.05)';
            }
          }}
        />

      </motion.div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none hidden lg:flex"
        style={{
          opacity: isVisible ? 0.4 : 0,
          transition: 'opacity 1s ease-out 2s',
          animation: prefersReducedMotion ? 'none' : 'scrollFloat 2s ease-in-out infinite',
        }}
      >
        <span className="font-mono text-[8px] tracking-[0.3em] text-neutral-500 uppercase">Scroll</span>
        <div className="w-[1px] h-6 bg-gradient-to-b from-neutral-500 to-transparent" />
      </div>

      {/* ═══ KEYFRAME ANIMATIONS ═══ */}
      <style>{`
        @keyframes heroGlow {
          0% { opacity: 0.5; transform: scale(1); }
          100% { opacity: 1; transform: scale(1.08); }
        }
        @keyframes shimmerText {
          0% { background-position: 100% 50%; }
          100% { background-position: -100% 50%; }
        }
        @keyframes borderGlow {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }

        @keyframes ringPulse {
          0% { transform: scale(0.95); opacity: 0.5; }
          100% { transform: scale(1.05); opacity: 1; }
        }
        @keyframes scrollFloat {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(6px); }
        }
      `}</style>
      </motion.div>
    </section>
  );
}
