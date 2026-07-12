import { useState, useEffect, useRef } from "react";
import { ArrowRight, ArrowDown } from "lucide-react";
import { PRODUCTS } from "../types";
import { useCart } from "./CartContext";
import { motion, AnimatePresence } from "motion/react";
import ProductCard from "./ProductCard";

function ScrambledTabButton({ tab, isSelected, onClick }: { tab: string; isSelected: boolean; onClick: () => void; key?: string }) {
  const [displayText, setDisplayText] = useState(tab);
  const intervalRef = useRef<any>(null);

  const triggerScramble = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    let iterations = 0;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_#@!$%&*";
    intervalRef.current = setInterval(() => {
      setDisplayText(
        tab
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iterations) return tab[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );
      iterations += 0.5;
      if (iterations >= tab.length + 1) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(tab);
      }
    }, 15);
  };

  useEffect(() => {
    if (isSelected) {
      triggerScramble();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isSelected]);

  return (
    <button
      onClick={onClick}
      onMouseEnter={triggerScramble}
      className="relative px-5 py-2.5 text-[11px] font-mono tracking-[0.2em] uppercase transition-colors duration-300 whitespace-nowrap focus:outline-none"
    >
      <span className={`relative z-10 font-sans font-medium transition-colors duration-300 ${isSelected ? "text-black font-semibold" : "text-neutral-400 hover:text-white"}`}>
        {displayText}
      </span>
      {isSelected && (
        <motion.div
          layoutId="activeTabPill"
          className="absolute inset-0 bg-white rounded-full"
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
        />
      )}
    </button>
  );
}

const CATEGORIES = [
  {
    name: "Oversized T Shirts",
    count: "4 PIECES",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop",
    mappedFilter: "Oversized T-Shirts"
  },
  {
    name: "Polo Shirts",
    count: "1 PIECE",
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=800&auto=format&fit=crop",
    mappedFilter: "Polo Shirts"
  },
  {
    name: "Pants",
    count: "2 PIECES",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop",
    mappedFilter: "Pants"
  },
  {
    name: "Baggy Pants",
    count: "2 PIECES",
    image: "https://images.unsplash.com/photo-1551854838-212c50b4c184?q=80&w=800&auto=format&fit=crop",
    mappedFilter: "Baggy Pants"
  }
];

export default function ProductRail() {
  const { searchQuery, activeFilter, setActiveFilter } = useCart();
  const [loadedCategories, setLoadedCategories] = useState<Record<string, boolean>>({});

  // Handle Category Card Clicks
  const handleCategoryClick = (mappedFilter: string) => {
    setActiveFilter(mappedFilter);
    const gridElement = document.getElementById("collection-grid");
    if (gridElement) {
      gridElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Filter products based on search and active filter
  const filteredProducts = PRODUCTS.filter((product) => {
    // Only display original 10 products on home page to keep landing page original catalog
    const isOriginalProduct = !product.id.startsWith("womens-");
    if (!isOriginalProduct) return false;

    const matchesSearch =
      searchQuery.trim() === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.fabric.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      searchQuery.trim() !== "" ||
      activeFilter === "ALL" ||
      product.category === activeFilter;

    return matchesSearch && matchesFilter;
  });

  const filterTabs = [
    "ALL",
    "Oversized T-Shirts",
    "Graphic Tees",
    "Custom Printed T-Shirts",
    "Polo Shirts",
    "Pants",
    "Baggy Pants",
    "Streetwear Collection",
    "Coming Soon Collection"
  ];

  return (
    <section id="shop-the-drop" className="py-24 bg-black scroll-mt-20 relative">
      {/* Shared vignette blend top & bottom to remove hard cuts */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#0B0B0D] to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0B0B0D] to-transparent pointer-events-none z-10" />
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* ==================== CURATED CATEGORIES ==================== */}
        <div className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4"
          >
            <div className="space-y-2">
              <p className="font-mono text-[9px] md:text-[10px] text-neutral-500 tracking-[0.3em] uppercase">
                CURATED CATEGORIES
              </p>
              <h2 className="font-display font-medium text-2xl md:text-3xl text-white tracking-tight uppercase">
                EXPLORE COLLECTIONS
              </h2>
            </div>
            <p className="text-xs text-neutral-500 max-w-xs font-sans font-light leading-relaxed">
              Click any category to open its dedicated collection and view all available streetwear drops.
            </p>
          </motion.div>

          {/* 4 Beautiful Category Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {CATEGORIES.map((cat, idx) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => handleCategoryClick(cat.mappedFilter)}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-900 cursor-pointer border border-neutral-900 transition-all duration-500 hover:border-neutral-700/80 hover:shadow-[0_12px_30px_rgba(0,0,0,0.7)]"
              >
                {/* Skeleton loader / Spinner */}
                {!loadedCategories[cat.name] && (
                  <div className="absolute inset-0 bg-neutral-950/60 animate-pulse flex items-center justify-center z-[5]">
                    <div className="w-6 h-6 rounded-full border-2 border-neutral-800 border-t-white/60 animate-spin" />
                  </div>
                )}
                {/* Image Zoom */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  onLoad={() => setLoadedCategories((prev) => ({ ...prev, [cat.name]: true }))}
                  className={`w-full h-full object-cover object-[center_25%] scale-100 group-hover:scale-105 transition-all duration-700 ease-out ${
                    loadedCategories[cat.name] ? "opacity-100" : "opacity-0"
                  }`}
                  referrerPolicy="no-referrer"
                />
                {/* Premium Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-500" />

                {/* Card Content & Premium Typography */}
                <div className="absolute inset-0 p-5 flex flex-col justify-end">
                  <span className="font-mono text-[8px] text-neutral-400 tracking-[0.2em] mb-1 uppercase block">
                    {cat.count}
                  </span>
                  <h3 className="font-display font-medium text-sm md:text-base text-white tracking-wider uppercase group-hover:text-white/90 transition-colors">
                    {cat.name}
                  </h3>
                  
                  {/* Subtle Indicator */}
                  <div className="mt-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <span className="font-mono text-[9px] text-white tracking-widest uppercase">DISCOVER</span>
                    <ArrowDown className="w-3 h-3 text-white animate-bounce" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ==================== COLLECTION NAVIGATION & PRODUCT GRID ==================== */}
        <div id="collection-grid" className="scroll-mt-24">
          <div className="space-y-4 mb-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-1.5">
                <p className="font-mono text-[9px] md:text-[10px] text-neutral-500 tracking-[0.3em] uppercase">
                  ACTIVE PRODUCTS
                </p>
                <h2 className="font-display font-medium text-xl md:text-2xl text-white tracking-tight uppercase">
                  {searchQuery.trim() !== "" ? `SEARCH RESULTS FOR "${searchQuery}"` : (activeFilter === "ALL" ? "ALL DROPS" : activeFilter.replace("-", " "))}
                </h2>
              </div>
              <span className="font-mono text-[10px] text-neutral-500 tracking-widest uppercase">
                SHOWING {filteredProducts.length} PIECES
              </span>
            </div>

            {/* Premium Horizontal Sliding Navigation */}
            <div className="border-b border-neutral-900 pb-2">
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth -mb-[1px]">
                {filterTabs.map((tab) => (
                  <ScrambledTabButton
                    key={tab}
                    tab={tab === "ALL" ? "ALL" : tab.toUpperCase()}
                    isSelected={activeFilter === tab}
                    onClick={() => setActiveFilter(tab)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-[#08080A] rounded-2xl border border-neutral-900">
              <div className="w-8 h-[1px] bg-neutral-800 mx-auto mb-4" />
              <p className="font-mono text-[10px] text-neutral-400 tracking-widest uppercase mb-1">
                NO PRODUCTS FOUND
              </p>
              <p className="text-xs text-neutral-600 font-sans max-w-xs mx-auto">
                No drops currently live in this collection. Browse another capsule drop above.
              </p>
              <button
                onClick={() => setActiveFilter("ALL")}
                className="mt-6 inline-flex items-center gap-2 bg-neutral-900 border border-neutral-800 text-white font-mono text-[10px] tracking-widest px-5 py-2.5 uppercase hover:bg-white hover:text-black hover:border-white rounded-md transition-all duration-300"
              >
                RESET FILTERS
              </button>
            </div>
          ) : (
            <>
              {/* Responsive Product Grid */}
              <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </AnimatePresence>
              </motion.div>
            </>
          )}
        </div>

      </div>
    </section>
  );
}
