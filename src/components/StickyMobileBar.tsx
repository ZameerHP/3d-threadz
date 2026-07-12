import { useState, useEffect } from "react";
import { ShoppingCart, Flame, ChevronUp } from "lucide-react";
import { PRODUCTS } from "../types";
import { useCart } from "./CartContext";
import { motion, AnimatePresence } from "motion/react";

export default function StickyMobileBar() {
  const { addToCart, cart } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Target the flagship product
  const flagship = PRODUCTS[0];

  useEffect(() => {
    const handleScroll = () => {
      // Show when user scrolls past the hero section (approx 450px)
      if (window.scrollY > 450) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAdd = () => {
    if (!selectedSize) {
      // Scroll to the product grid so they can see sizing if they haven't picked one yet
      const element = document.getElementById("shop-the-drop");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    addToCart(flagship, selectedSize, 1);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 2000);
  };

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "tween", duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-30 bg-graphite-dark/95 backdrop-blur-md border-t border-neutral-900 p-4 md:hidden flex items-center justify-between gap-4"
        >
          {/* Product Thumbnail & Quick Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 aspect-square rounded overflow-hidden border border-neutral-800 bg-neutral-950 flex-shrink-0">
              <img
                src={flagship.image}
                alt={flagship.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="min-w-0">
              <p className="font-display font-bold text-[10px] text-white tracking-wider truncate uppercase">
                {flagship.name}
              </p>
              <span className="font-mono text-[10px] text-neutral-400 font-bold">₨{flagship.price.toLocaleString()}</span>
            </div>
          </div>

          {/* Sizing & Add Button Section */}
          <div className="flex items-center gap-2">
            {/* Tiny size dropdown */}
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="bg-neutral-950 border border-neutral-800 text-white font-mono text-[10px] tracking-widest px-2.5 py-2.5 rounded uppercase focus:border-neutral-500 outline-none"
              aria-label="Select size for sticky cart"
            >
              <option value="">SIZE</option>
              {flagship.sizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>

            {/* Quick purchase button */}
            <button
              onClick={handleAdd}
              className={`
                px-4 py-2.5 font-mono text-[10px] tracking-widest font-bold rounded uppercase transition-all duration-300 flex items-center gap-1.5 border focus-visible:outline-neutral-300
                ${isSuccess
                  ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                  : "bg-white text-black hover:bg-neutral-200 border-white"
                }
              `}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>{isSuccess ? "ADDED" : "ADD"}</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
