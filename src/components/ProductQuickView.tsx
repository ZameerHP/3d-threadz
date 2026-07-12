import { useState, useEffect, useRef } from "react";
import { X, ShoppingBag, Ruler, Check, Heart, HelpCircle, ZoomIn, Wand2, Palette } from "lucide-react";
import { Product } from "../types";
import { useCart } from "./CartContext";
import { motion, AnimatePresence } from "motion/react";
import { Lens } from "./Lens";
import { CometCard } from "./CometCard";
import heroTee from "../assets/images/hero_tee_1783496003151.jpg";

export default function ProductQuickView() {
  const { quickViewProduct, setQuickViewProduct, addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [activeTab, setActiveTab] = useState<"specs" | "details" | "care">("specs");
  const [activeImage, setActiveImage] = useState<"primary" | "hover">("primary");
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isLensActive, setIsLensActive] = useState(true);

  // Custom AI Prompt studio states
  const [promptText, setPromptText] = useState("");
  const [printStyle, setPrintStyle] = useState("3D Embossed Chrome");
  const [shirtColor, setShirtColor] = useState("Graphite Black");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [generationStage, setGenerationStage] = useState(0);

  const modalRef = useRef<HTMLDivElement>(null);

  // Clean up states when quickViewProduct changes or closes
  useEffect(() => {
    if (!quickViewProduct) {
      setPromptText("");
      setIsGenerating(false);
      setIsGenerated(false);
      setGenerationStage(0);
      setSelectedSize("");
      setActiveTab("specs");
      setActiveImage("primary");
    }
  }, [quickViewProduct]);

  // Handle Escape key closing and body scroll lock
  useEffect(() => {
    if (quickViewProduct) {
      document.body.style.overflow = "hidden";
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape" && !isSizeChartOpen) {
          setQuickViewProduct(null);
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [quickViewProduct, setQuickViewProduct, isSizeChartOpen]);

  // Trap focus inside modal
  useEffect(() => {
    if (quickViewProduct && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
        
        const handleFocusTrap = (e: KeyboardEvent) => {
          if (e.key !== "Tab") return;
          
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement.focus();
              e.preventDefault();
            }
          }
        };

        firstElement.focus();
        window.addEventListener("keydown", handleFocusTrap);
        return () => window.removeEventListener("keydown", handleFocusTrap);
      }
    }
  }, [quickViewProduct]);

  useEffect(() => {
    if (!isGenerating) return;
    setGenerationStage(0);
    const interval = setInterval(() => {
      setGenerationStage((prev) => {
        if (prev >= 3) {
          clearInterval(interval);
          setIsGenerating(false);
          setIsGenerated(true);
          return 3;
        }
        return prev + 1;
      });
    }, 900);
    return () => clearInterval(interval);
  }, [isGenerating]);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const isCustomTee = product.id === "bespoke-custom-printed-tee";

  const handleAdd = () => {
    if (!selectedSize) return;
    setIsAdding(true);
    setTimeout(() => {
      if (isCustomTee && promptText.trim()) {
        // Construct a highly personalized custom product object
        const customProduct: Product = {
          ...product,
          name: `AI TEE: "${promptText.substring(0, 18).toUpperCase()}..."`,
          description: `Custom AI Streetwear Design. Style: ${printStyle} // Color: ${shirtColor} // Prompt: "${promptText}"`,
          image: heroTee
        };
        addToCart(customProduct, selectedSize, 1);
      } else {
        addToCart(product, selectedSize, 1);
      }
      setIsAdding(false);
    }, 800);
  };

  // Mock Size Chart specs
  const sizeChart = [
    { size: "S", chest: "22.5 in / 57 cm", length: "27.5 in / 70 cm", shoulder: "20.5 in / 52 cm" },
    { size: "M", chest: "23.5 in / 60 cm", length: "28.5 in / 72 cm", shoulder: "21.5 in / 55 cm" },
    { size: "L", chest: "24.5 in / 62 cm", length: "29.5 in / 75 cm", shoulder: "22.5 in / 57 cm" },
    { size: "XL", chest: "25.5 in / 65 cm", length: "30.5 in / 77 cm", shoulder: "23.5 in / 60 cm" },
    { size: "XXL", chest: "26.5 in / 67 cm", length: "31.5 in / 80 cm", shoulder: "24.5 in / 62 cm" }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        {/* Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          exit={{ opacity: 0 }}
          onClick={() => setQuickViewProduct(null)}
          className="fixed inset-0 bg-black cursor-zoom-out"
        />

        {/* Modal Window */}
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          role="dialog"
          aria-modal="true"
          aria-label="Product Details"
          className="relative bg-graphite-dark border border-neutral-900 rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto overflow-x-hidden z-10 shadow-2xl no-scrollbar grid grid-cols-1 lg:grid-cols-12"
        >
          {/* Close trigger button */}
          <button
            onClick={() => setQuickViewProduct(null)}
            className="absolute top-4 right-4 z-20 p-2 bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 text-neutral-400 hover:text-white transition-colors rounded-full focus-visible:outline-neutral-500"
            aria-label="Close details overlay"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Side: Image Gallery */}
          <div className="lg:col-span-6 p-6 md:p-8 flex flex-col justify-between bg-neutral-950/60 border-r border-neutral-900">
            <div className="relative w-full aspect-square rounded overflow-hidden border border-neutral-900 bg-neutral-950 shadow-2xl">
              <div 
                className="relative w-full h-full flex items-center justify-center cursor-pointer group"
              >
                <Lens 
                  isActive={true} 
                  zoomFactor={2.5} 
                  lensSize={200} 
                  imageUrl={activeImage === "primary" ? product.image : (product.hoverImage || product.image)}
                >
                  <img
                    src={activeImage === "primary" ? product.image : (product.hoverImage || product.image)}
                    alt={product.name}
                    className="w-full h-full object-cover select-none pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                </Lens>

                {/* Status overlay badge indicating Lens zoom status */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-[#0B0B0D]/85 backdrop-blur-sm border border-neutral-800 px-3 py-1.5 rounded-full text-white font-mono text-[9px] tracking-widest uppercase transition-all duration-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>ZOOM LENS ACTIVE</span>
                </div>

                {/* Angle selector badges */}
                <div 
                  className="absolute bottom-4 left-4 flex gap-2 z-30"
                  onClick={(e) => e.stopPropagation()} // Prevent triggering zoom on clicking buttons
                >
                  <button
                    onClick={() => setActiveImage("primary")}
                    className={`px-3 py-1.5 font-mono text-[9px] tracking-widest rounded uppercase transition-colors border ${
                      activeImage === "primary"
                        ? "bg-white text-black border-white font-bold"
                        : "bg-[#0B0B0D]/85 text-neutral-400 border-neutral-800 hover:text-white"
                    }`}
                  >
                    ANGLE 01 (FRONT)
                  </button>
                  {product.hoverImage && (
                    <button
                      onClick={() => setActiveImage("hover")}
                      className={`px-3 py-1.5 font-mono text-[9px] tracking-widest rounded uppercase transition-colors border ${
                        activeImage === "hover"
                          ? "bg-white text-black border-white font-bold"
                          : "bg-[#0B0B0D]/85 text-neutral-400 border-neutral-800 hover:text-white"
                      }`}
                    >
                      ANGLE 02 (MODEL)
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Quick trust assurances */}
            <div className="grid grid-cols-3 gap-4 mt-6 text-center text-neutral-500 font-mono text-[9px] uppercase tracking-widest">
              <div className="border border-neutral-900/80 p-3 rounded bg-[#0B0B0D]/40">
                <span className="text-white font-bold block mb-1">FAST</span>
                <span>PK DELIVERY</span>
              </div>
              <div className="border border-neutral-900/80 p-3 rounded bg-[#0B0B0D]/40">
                <span className="text-white font-bold block mb-1">SECURE</span>
                <span>COD AVAILABLE</span>
              </div>
              <div className="border border-neutral-900/80 p-3 rounded bg-[#0B0B0D]/40">
                <span className="text-white font-bold block mb-1">100%</span>
                <span>MADE IN PK</span>
              </div>
            </div>
          </div>

          {/* Right Side: Product Details & Purchase Form */}
          <div className="lg:col-span-6 p-6 md:p-8 flex flex-col justify-between space-y-6">
            {isCustomTee ? (
              // ═══════════════════════════════════════════════════════════════════
              // CUSTOM STUDIO (PROMPT PAGE CUSTOMIZER)
              // ═══════════════════════════════════════════════════════════════════
              <div className="space-y-5">
                {/* Header */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-neutral-400 font-mono text-[9px] tracking-widest font-bold uppercase">
                    <div className="w-3 h-[1px] bg-neutral-500" />
                    <span>CUSTOM CREATOR LAB</span>
                  </div>
                  <h1 className="font-display font-bold text-xl md:text-2xl text-white tracking-wider uppercase">
                    CUSTOM PRINT LAB
                  </h1>
                  <div className="flex items-center gap-2 font-mono text-sm">
                    <span className="text-white font-bold text-base">₨{product.price.toLocaleString()}</span>
                    {product.originalPrice && (
                      <span className="text-neutral-500 line-through">₨{product.originalPrice.toLocaleString()}</span>
                    )}
                  </div>
                </div>

                <p className="font-sans font-light text-xs text-neutral-400 leading-relaxed">
                  Describe your custom graphic concept below to personalize your signature oversized tee, complete with high-density embossed metal or puff print finishes.
                </p>

                {/* Prompt block */}
                <div className="space-y-2 border-t border-neutral-900 pt-4">
                  <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-bold block">
                    ENTER CUSTOM TEXT OR CONCEPT
                  </label>
                  <textarea
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    placeholder="e.g. 'chrome liquid metal cross' or 'retro cyberpunk monogram'"
                    disabled={isGenerating}
                    className="w-full bg-neutral-950 border border-neutral-900 focus:border-neutral-700 text-white font-mono text-xs p-3 outline-none rounded min-h-[70px] placeholder:text-neutral-800 disabled:opacity-50"
                  />
                  {/* Style presets */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {["CYBERPUNK", "LIQUID CHROME", "STEALTH MONOGRAM", "KANJI", "VINTAGE WASH"].map((preset) => (
                      <button
                        key={preset}
                        disabled={isGenerating}
                        onClick={() => setPromptText((prev) => prev ? `${prev}, ${preset}` : preset)}
                        className="text-[9px] font-mono bg-neutral-900 hover:bg-neutral-800 border border-neutral-800/80 text-neutral-400 hover:text-white px-2 py-1 rounded transition-colors disabled:opacity-40"
                      >
                        +{preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Styles Selectors */}
                <div className="grid grid-cols-2 gap-4 border-t border-neutral-900 pt-4">
                  <div className="space-y-1.5">
                    <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest block font-bold">PRINT FINISH</span>
                    <select
                      value={printStyle}
                      onChange={(e) => setPrintStyle(e.target.value)}
                      disabled={isGenerating}
                      className="w-full bg-neutral-950 border border-neutral-900 focus:border-neutral-700 text-neutral-300 font-mono text-[10px] p-2.5 outline-none rounded uppercase disabled:opacity-50"
                    >
                      {["3D EMBOSSED CHROME", "LIQUID METAL SHINE", "HIGH-DENSITY PUFF", "REFLECTIVE FUTURE FOIL"].map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest block font-bold">SHIRT COLOR</span>
                    <select
                      value={shirtColor}
                      onChange={(e) => setShirtColor(e.target.value)}
                      disabled={isGenerating}
                      className="w-full bg-neutral-950 border border-neutral-900 focus:border-neutral-700 text-neutral-300 font-mono text-[10px] p-2.5 outline-none rounded uppercase disabled:opacity-50"
                    >
                      {["GRAPHITE BLACK", "SILVER ASH", "HEAVY CHARCOAL", "CYBER NEON"].map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Size Selector */}
                <div className="space-y-2 border-t border-neutral-900 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-bold">
                      SELECT FIT SIZE
                    </span>
                    <button
                      onClick={() => setIsSizeChartOpen(true)}
                      className="inline-flex items-center gap-1 font-mono text-[10px] text-neutral-400 hover:text-white transition-colors uppercase tracking-widest"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      <span>SIZE GUIDE</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => {
                      const active = selectedSize === size;
                      return (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          disabled={isGenerating}
                          className={`h-9 min-w-9 px-2 font-mono text-xs tracking-wider rounded border transition-all flex items-center justify-center disabled:opacity-40 ${
                            active
                              ? "bg-white text-black border-white font-bold"
                              : "bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border-neutral-800"
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Status messages and CTA button */}
                <div className="border-t border-neutral-900 pt-5 space-y-3">
                  {isGenerating && (
                    <div className="space-y-2 bg-[#0B0B0D] border border-neutral-900 p-4 rounded-lg">
                      <div className="flex items-center justify-between font-mono text-[9px] tracking-wider text-neutral-400 uppercase">
                        <span>
                          {generationStage === 0 && "● PROCESSING DESIGN CONCEPT..."}
                          {generationStage === 1 && "● PREPARING LIQUID ALIGNMENTS..."}
                          {generationStage === 2 && "● CALIBRATING EMBOSS DEPTH..."}
                          {generationStage === 3 && "● COMPILED CUSTOM MOCKUP..."}
                        </span>
                        <span>{Math.round(((generationStage + 1) / 4) * 100)}%</span>
                      </div>
                      <div className="w-full bg-neutral-950 h-1 rounded-full overflow-hidden">
                        <div
                          className="bg-white h-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                          style={{ width: `${((generationStage + 1) / 4) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {isGenerated && !isGenerating && (
                    <div className="bg-emerald-950/20 border border-emerald-900/60 p-3.5 rounded-lg flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      <span className="font-mono text-[9px] text-emerald-400 tracking-wider uppercase font-bold">
                        DESIGN PROCESSED // READY TO PLACE ORDER
                      </span>
                    </div>
                  )}

                  <div className="flex gap-3">
                    {!isGenerated ? (
                      <button
                        onClick={() => setIsGenerating(true)}
                        disabled={!promptText.trim() || isGenerating}
                        className={`w-full py-4 font-mono text-[10px] tracking-[0.25em] font-bold rounded uppercase transition-all duration-300 flex items-center justify-center gap-2 border ${
                          !promptText.trim() || isGenerating
                            ? "bg-neutral-900 text-neutral-600 border-neutral-900 cursor-not-allowed"
                            : "bg-white text-black hover:bg-neutral-200 border-white shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]"
                        }`}
                      >
                        <Wand2 className="w-4 h-4" />
                        <span>GENERATE DESIGN</span>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={handleAdd}
                          disabled={!selectedSize || isAdding}
                          className={`flex-grow py-4 font-mono text-[10px] tracking-[0.25em] font-bold rounded uppercase transition-all duration-300 flex items-center justify-center gap-2 border ${
                            !selectedSize
                              ? "bg-neutral-900 text-neutral-600 border-neutral-900 cursor-not-allowed"
                              : isAdding
                                ? "bg-neutral-950 text-white border-neutral-800"
                                : "bg-white text-black hover:bg-neutral-200 border-white shadow-[0_0_25px_rgba(255,255,255,0.15)]"
                          }`}
                        >
                          {isAdding ? (
                            <div className="w-4 h-4 rounded-full border-2 border-neutral-800 border-t-white animate-spin" />
                          ) : (
                            <>
                              <ShoppingBag className="w-4 h-4" />
                              <span>{selectedSize ? "ADD CUSTOM TEE TO BAG" : "SELECT A SIZE"}</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setIsGenerated(false);
                            setPromptText("");
                          }}
                          className="px-5 py-4 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 rounded font-mono text-[10px] uppercase font-bold tracking-widest transition-colors"
                        >
                          RESET
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              // ═══════════════════════════════════════════════════════════════════
              // STANDARD PRODUCT DETAILS
              // ═══════════════════════════════════════════════════════════════════
              <div className="space-y-5">
                {/* Badge & Stock Limit */}
                <div className="flex flex-wrap items-center gap-3">
                  {product.badge && (
                    <span 
                      className="bg-neutral-900 border-x border-b border-neutral-800 border-t border-white/10 text-white font-mono text-[9px] font-bold tracking-widest px-2.5 py-1 rounded"
                      style={{
                        boxShadow: '0 1px 2px rgba(0,0,0,.4), 0 4px 12px rgba(0,0,0,.25)'
                      }}
                    >
                      {product.badge}
                    </span>
                  )}
                  <span className="text-[10px] font-mono text-neutral-400 font-bold tracking-widest uppercase flex items-center gap-1">
                    ● EXCLUSIVE DROP // LIMITED PIECES AVAILABLE
                  </span>
                </div>

                {/* Title & Price */}
                <div className="space-y-1">
                  <h1 className="font-display font-bold text-xl md:text-2xl text-white tracking-wider uppercase leading-tight">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-2 font-mono text-sm">
                    <span className="text-white font-bold text-base">₨{product.price.toLocaleString()}</span>
                    {product.originalPrice && (
                      <span className="text-neutral-500 line-through">₨{product.originalPrice.toLocaleString()}</span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="font-sans font-light text-xs md:text-sm text-neutral-400 leading-relaxed">
                  {product.description}
                </p>

                {/* Size Selector */}
                <div className="space-y-2 border-y border-neutral-900 py-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-bold">
                      SELECT SIZE
                    </span>
                    <button
                      onClick={() => setIsSizeChartOpen(true)}
                      className="inline-flex items-center gap-1 font-mono text-[10px] text-neutral-400 hover:text-white transition-colors uppercase tracking-widest"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      <span>SIZE GUIDE</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => {
                      const active = selectedSize === size;
                      return (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`h-9 min-w-9 px-2 font-mono text-xs tracking-wider rounded border transition-all flex items-center justify-center focus-visible:outline-neutral-500 ${
                            active
                              ? "bg-white text-black border-white font-bold"
                              : "bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border-neutral-800"
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tabs */}
                <div className="space-y-3">
                  <div className="flex border-b border-neutral-900 text-[10px] font-mono tracking-widest uppercase">
                    {(["specs", "details", "care"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-2 pr-6 transition-colors ${
                          activeTab === tab ? "text-white font-bold border-b-2 border-white" : "text-neutral-500 hover:text-neutral-300"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  <div className="min-h-[90px] text-xs leading-relaxed text-neutral-400 space-y-2 pt-2">
                    {activeTab === "specs" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-neutral-500 block text-[9px] font-mono uppercase tracking-widest">FABRIC WEIGHT</span>
                          <span className="text-neutral-300 uppercase font-mono">{product.weight}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 block text-[9px] font-mono uppercase tracking-widest">FABRIC COMP</span>
                          <span className="text-neutral-300 uppercase font-mono">{product.fabric}</span>
                        </div>
                      </div>
                    )}

                    {activeTab === "details" && (
                      <ul className="list-disc pl-4 space-y-1">
                        {product.details.map((detail, i) => (
                          <li key={i} className="font-light">{detail}</li>
                        ))}
                      </ul>
                    )}

                    {activeTab === "care" && (
                      <p className="font-light">
                        Machine wash cold inside-out on gentle cycle. Do not bleach. Air dry in shade or tumble dry low. Do not iron directly on the high-density silver chrome screen-print graphic.
                      </p>
                    )}
                  </div>
                </div>

                {/* Purchase Buttons */}
                <div className="flex items-center gap-3 border-t border-neutral-900 pt-5 mt-4">
                  <button
                    onClick={handleAdd}
                    disabled={!selectedSize || isAdding}
                    className={`
                      flex-grow py-4 font-mono text-[10px] tracking-[0.25em] font-bold rounded uppercase transition-all duration-300 flex items-center justify-center gap-2 border focus-visible:outline-neutral-300
                      ${!selectedSize
                        ? "bg-neutral-900 text-neutral-600 border-neutral-900 cursor-not-allowed"
                        : isAdding
                          ? "bg-neutral-950 text-white border-neutral-800"
                          : "bg-white text-black hover:bg-neutral-200 border-white"
                      }
                    `}
                  >
                    {isAdding ? (
                      <div className="w-4 h-4 rounded-full border-2 border-neutral-800 border-t-white animate-spin" />
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>{selectedSize ? "ADD TO BAG" : "SELECT A SIZE"}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`p-4 rounded border transition-colors focus-visible:outline-neutral-500 ${
                      isWishlisted
                        ? "bg-rose-950/40 text-rose-400 border-rose-800/80"
                        : "bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border-neutral-800"
                    }`}
                    aria-label="Add to wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Size Chart Sub-Modal */}
      {isSizeChartOpen && (
        <div className="fixed inset-0 z-60 overflow-hidden flex items-center justify-center p-4">
          <div onClick={() => setIsSizeChartOpen(false)} className="absolute inset-0 bg-black/85 cursor-pointer" />
          <div className="relative bg-graphite-black border border-neutral-900 p-6 md:p-8 rounded-lg max-w-lg w-full z-10 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-neutral-900">
              <span className="font-display font-bold text-xs tracking-widest text-white uppercase">
                3D THREADZ FIT CHART
              </span>
              <button onClick={() => setIsSizeChartOpen(false)} className="p-1 text-neutral-400 hover:text-white rounded">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-400 font-sans leading-relaxed">
              Our oversized cuts are engineered with a boxy, dropped-shoulder silhouette. We recommend taking your standard size for the intended streetwear slouch. Size down for a more fitted, classic drape.
            </p>

            <div className="overflow-x-auto border border-neutral-900 rounded">
              <table className="w-full text-left font-mono text-[11px] uppercase tracking-wider text-neutral-300">
                <thead>
                  <tr className="bg-neutral-950 border-b border-neutral-900 text-neutral-500 font-bold">
                    <th className="p-3">SIZE</th>
                    <th className="p-3">CHEST WIDTH</th>
                    <th className="p-3">BODY LENGTH</th>
                    <th className="p-3">SHOULDER</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900/60 bg-neutral-950/30">
                  {sizeChart.map((row) => (
                    <tr key={row.size} className="hover:bg-neutral-900/40">
                      <td className="p-3 font-bold text-white">{row.size}</td>
                      <td className="p-3">{row.chest}</td>
                      <td className="p-3">{row.length}</td>
                      <td className="p-3">{row.shoulder}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={() => setIsSizeChartOpen(false)}
              className="w-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 py-3 text-center text-white font-mono text-[10px] tracking-widest uppercase transition-all rounded"
            >
              BACK TO SPEC DETAILS
            </button>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
