import { useState } from "react";
import { Check } from "lucide-react";
import { Product } from "../types";
import { useCart } from "./CartContext";
import { motion } from "motion/react";
import { CometCard } from "./CometCard";
import ClickSpark from "./react-bits/ClickSpark";

export const PRODUCT_COLORS: Record<string, string[]> = {
  "3d-chrome-oversized-tee": ["#141416", "#F3F4F6", "#374151"], // Black, White, Charcoal
  "liquid-metal-archive-tee": ["#2C2C2C", "#141416", "#D1D5DB"], // Graphite, Black, Silver
  "stealth-monogram-classic-polo": ["#0B0B0D", "#1E293B"], // Black, Navy
  "bespoke-custom-printed-tee": ["#FFFFFF", "#0A0A0C", "#9CA3AF"], // White, Black, Ash Gray
  "vintage-acid-wash-tee": ["#374151", "#1F2937", "#4B5563"], // Acid Grey, Dark Acid, Vintage Blue
  "neo-cyber-future-tee": ["#000000", "#9CA3AF"], // Black, Reflective
  "metropolis-pleated-pants": ["#3F3F46", "#09090B", "#A1A1AA"], // Charcoal, Black, Slate
  "utility-stealth-cargo-pants": ["#365314", "#D97706", "#000000"], // Olive, Sand, Black
  "stealth-drop-crotch-baggy": ["#4B5563", "#000000"], // Grey, Black
  "heavy-loopback-baggy-sweats": ["#71717A", "#18181B"], // Grey, Dark Charcoal
  "womens-vogue-cream-tee": ["#F3F4F6", "#141416"], // Cream, Black
  "womens-nice-teddy-black-tee": ["#141416"], // Black
  "womens-runaway-bunny-black-tee": ["#141416"], // Black
  "womens-butterfly-mauve-tee": ["#8A4F58", "#141416"], // Mauve, Black
  "womens-positive-sakura-pink-tee": ["#FFC0CB", "#141416"], // Pink, Black
  "womens-pragya-star-pink-tee": ["#FFC0CB", "#141416"], // Pink, Black
  "womens-rose-white-tee": ["#FFFFFF", "#141416"], // White, Black
  "womens-stealth-polo": ["#0B0B0D", "#D1D5DB"], // Stealth Black, Silver
  "womens-pleated-trousers": ["#141416", "#3F3F46", "#A1A1AA"] // Black, Charcoal, Slate
};

export const COLOR_NAMES: Record<string, string> = {
  "#141416": "Black",
  "#F3F4F6": "White",
  "#374151": "Charcoal",
  "#2C2C2C": "Graphite",
  "#D1D5DB": "Silver",
  "#0B0B0D": "Stealth Black",
  "#1E293B": "Navy",
  "#FFFFFF": "Pure White",
  "#0A0A0C": "Core Black",
  "#9CA3AF": "Ash Gray",
  "#1F2937": "Dark Acid",
  "#4B5563": "Vintage Blue",
  "#000000": "Jet Black",
  "#3F3F46": "Charcoal Grey",
  "#09090B": "Midnight",
  "#A1A1AA": "Slate",
  "#365314": "Olive",
  "#D97706": "Sand",
  "#71717A": "Heather Grey",
  "#18181B": "Dark Charcoal",
  "#8A4F58": "Dusty Rose",
  "#FFC0CB": "Sakura Pink"
};

interface ProductCardProps {
  product: Product;
  layout?: boolean;
}

export default function ProductCard({ product, layout = true }: ProductCardProps) {
  const { addToCart, setQuickViewProduct } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>(
    PRODUCT_COLORS[product.id]?.[0] || "#222222"
  );
  const [isMainLoaded, setIsMainLoaded] = useState(false);
  const [feedback, setFeedback] = useState<string>("");

  const handleAddClick = () => {
    if (!selectedSize) {
      setFeedback("SELECT SIZE");
      setTimeout(() => setFeedback(""), 2000);
      return;
    }

    addToCart(product, selectedSize, 1);
    setFeedback("ADDED TO BAG");
    setTimeout(() => setFeedback(""), 2500);
  };

  return (
    <motion.div
      layout={layout}
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 30 }}
      transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
    >
      <CometCard className="group relative flex flex-col bg-[#121215]/40 backdrop-blur-md rounded-2xl border border-neutral-900/50 p-4 transition-all duration-500">
        {/* Product Image Container */}
        <div
          onClick={() => setQuickViewProduct(product)}
          className="relative w-full aspect-[4/5] bg-neutral-950 rounded-xl overflow-hidden cursor-pointer mb-4 border border-neutral-900/30"
        >
          {product.badge && (
            <span
              className="absolute top-3 left-3 z-[15] font-mono text-[9px] font-bold tracking-widest bg-[#0B0B0D]/90 border-x border-b border-neutral-800 border-t border-white/10 text-white px-2.5 py-1 rounded select-none pointer-events-none"
              style={{
                boxShadow: "0 1px 2px rgba(0,0,0,.4), 0 4px 12px rgba(0,0,0,.25)",
              }}
            >
              {product.badge}
            </span>
          )}
          {/* Skeleton loader */}
          {!isMainLoaded && (
            <div className="absolute inset-0 bg-neutral-900/50 animate-pulse flex items-center justify-center z-[5]">
              <div className="w-5 h-5 rounded-full border-2 border-neutral-800 border-t-white/40 animate-spin" />
            </div>
          )}
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            onLoad={() => setIsMainLoaded(true)}
            className={`w-full h-full object-cover scale-[1.01] group-hover:scale-[1.05] transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
              isMainLoaded ? "opacity-100" : "opacity-0"
            }`}
            referrerPolicy="no-referrer"
          />
          {product.hoverImage && (
            <img
              src={product.hoverImage}
              alt={`${product.name} hover view`}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] pointer-events-none"
              referrerPolicy="no-referrer"
            />
          )}
          {/* Shimmer gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </div>

        {/* Info Layer */}
        <div className="flex-grow flex flex-col justify-between space-y-4">
          <div>
            {/* Product Name */}
            <h3
              onClick={() => setQuickViewProduct(product)}
              className="font-sans font-medium text-[13px] tracking-wider text-neutral-300 group-hover:text-white transition-colors uppercase leading-snug cursor-pointer mb-1 truncate"
            >
              {product.name}
            </h3>

            {/* Price */}
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-white font-bold text-sm">
                ₨{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-neutral-500 line-through text-[10px]">
                  ₨{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* Colors & Sizes Row */}
          <div className="flex flex-col gap-3 border-t border-neutral-900/80 pt-3">
            <div className="flex items-center justify-between gap-2">
              {/* Available colors swatches */}
              <div className="flex items-center gap-1.5">
                {(PRODUCT_COLORS[product.id] || ["#222222"]).map((color, idx) => {
                  const isSelectedColor = selectedColor === color;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(color)}
                      className={`w-3.5 h-3.5 rounded-full border transition-all duration-200 cursor-pointer ${
                        isSelectedColor
                          ? "border-white ring-1 ring-white/50 scale-110"
                          : "border-white/10 hover:border-white/40"
                      }`}
                      style={{ backgroundColor: color }}
                      title={COLOR_NAMES[color] || "Color"}
                    />
                  );
                })}
              </div>

              {/* Selected Color & Size Header */}
              <span className="font-mono text-[8px] text-neutral-400 tracking-wider font-bold uppercase">
                {selectedColor
                  ? `${COLOR_NAMES[selectedColor] || "Color"} / ${selectedSize || "SIZE"}`
                  : `Color / ${selectedSize || "SIZE"}`}
              </span>
            </div>

            {/* Size Selector Pills */}
            <div className="flex flex-wrap gap-1">
              {product.sizes.map((size) => {
                const active = selectedSize === size;
                return (
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    aria-label={`Select size ${size} for ${product.name}`}
                    className={`h-6 min-w-[24px] px-1.5 font-mono text-[10px] tracking-wider rounded-sm transition-all duration-300 flex items-center justify-center border cursor-pointer ${
                      active
                        ? "bg-white text-black border-white font-bold"
                        : "bg-neutral-950 border-neutral-900/60 text-neutral-500 hover:text-white hover:border-neutral-700"
                    }`}
                  >
                    {size}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Add to Cart Button */}
          <ClickSpark className="w-full">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleAddClick}
              aria-label={`Add ${product.name} to cart`}
              className={`
                w-full py-3 px-4 font-mono text-[10px] tracking-[0.2em] font-bold rounded-lg uppercase transition-all duration-500 flex items-center justify-center gap-1.5 border cursor-pointer
                ${
                  feedback === "ADDED TO BAG"
                    ? "bg-emerald-950/20 text-emerald-400 border-emerald-900/40"
                    : feedback === "SELECT SIZE"
                    ? "bg-rose-950/20 text-rose-400 border-rose-800/40"
                    : "bg-white text-black border-white hover:bg-transparent hover:text-white hover:border-neutral-700"
                }
              `}
            >
              {feedback === "ADDED TO BAG" ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>ADDED</span>
                </>
              ) : feedback === "SELECT SIZE" ? (
                <span>CHOOSE SIZE</span>
              ) : (
                <span>ADD TO CART</span>
              )}
            </motion.button>
          </ClickSpark>
        </div>
      </CometCard>
    </motion.div>
  );
}
