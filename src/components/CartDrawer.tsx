import { useState, useEffect, useMemo, useRef, FormEvent } from "react";
import { X, Trash2, Plus, Minus, CreditCard, ArrowRight, CheckCircle, Flame } from "lucide-react";
import { useCart } from "./CartContext";
import { motion, AnimatePresence } from "motion/react";

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, clearCart, setCurrentView } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoDiscount, setPromoDiscount] = useState(0); // decimal e.g. 0.20
  const [promoError, setPromoError] = useState("");

  const panelRef = useRef<HTMLDivElement>(null);

  // Manage body scroll lock and escape key close
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsCartOpen(false);
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isCartOpen, setIsCartOpen]);

  // Trap focus inside drawer
  useEffect(() => {
    if (isCartOpen && panelRef.current) {
      const focusableElements = panelRef.current.querySelectorAll(
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
  }, [isCartOpen]);

  const handleApplyPromo = (e: FormEvent) => {
    e.preventDefault();
    setPromoError("");
    const formatted = promoCode.trim().toUpperCase();
    if (formatted === "METAL20") {
      setAppliedPromo("METAL20");
      setPromoDiscount(0.20);
      setPromoCode("");
    } else {
      setPromoError("INVALID OR EXPIRED DISCOUNT CODE");
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoDiscount(0);
  };

  // Memoized Cart math
  const cartTotals = useMemo(() => {
    const subtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
    const discountAmount = subtotal * promoDiscount;
    const discountedSubtotal = subtotal - discountAmount;
    
    // Free shipping threshold at ₨4,999
    const shippingThreshold = 4999;
    const isFreeShipping = discountedSubtotal >= shippingThreshold;
    const shippingCost = cart.length === 0 ? 0 : (isFreeShipping ? 0 : 200);
    const total = discountedSubtotal + shippingCost;
    const remainingForFreeShipping = Math.max(0, shippingThreshold - discountedSubtotal);
    const freeShippingProgress = Math.min(100, (discountedSubtotal / shippingThreshold) * 100);

    return {
      subtotal,
      discountAmount,
      discountedSubtotal,
      isFreeShipping,
      shippingCost,
      total,
      remainingForFreeShipping,
      freeShippingProgress,
    };
  }, [cart, promoDiscount]);

  const {
    subtotal,
    discountAmount,
    discountedSubtotal,
    isFreeShipping,
    shippingCost,
    total,
    remainingForFreeShipping,
    freeShippingProgress,
  } = cartTotals;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setCurrentView("checkout");
  };

  if (!isCartOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Dark Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            setIsCartOpen(false);
          }}
          className="absolute inset-0 bg-black cursor-crosshair"
        />

        {/* Sliding Panel */}
        <motion.div
          ref={panelRef}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-label="Shopping Cart Drawer"
          className="absolute inset-y-0 right-0 w-full md:max-w-md bg-graphite-dark border-l border-neutral-900 shadow-2xl flex flex-col justify-between"
        >
          {/* Cart Header */}
          <div className="p-6 border-b border-neutral-900 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs text-neutral-400">({cart.length})</span>
              <h3 className="font-display font-bold text-sm tracking-widest text-white uppercase">
                YOUR SHOPPING BAG
              </h3>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-neutral-400 hover:text-white rounded"
              aria-label="Close shopping bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Empty state or cart content */}
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
              <Flame className="w-8 h-8 text-neutral-700 animate-pulse" />
              <h4 className="font-display font-bold text-xs tracking-widest text-white uppercase">
                BAG IS CURRENTLY EMPTY
              </h4>
              <p className="text-xs text-neutral-500 font-sans max-w-xs">
                No items have been curated. Browse our Capsule Drop 004 catalog and lock down your preferred print styles.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-4 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-white font-mono text-[10px] tracking-widest py-3 px-6 uppercase rounded transition-colors"
              >
                CONTINUE EXPLORING
              </button>
            </div>
          ) : (
            <>
              {/* Free Shipping Dynamic Progress Tracker */}
              <div className="px-6 py-4 bg-neutral-950/80 border-b border-neutral-900 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono tracking-wider">
                  {isFreeShipping ? (
                    <span className="text-emerald-400 font-bold uppercase flex items-center gap-1.5">
                      ★ FREE NATIONWIDE DELIVERY ALL OVER PAKISTAN EARNED
                    </span>
                  ) : (
                    <span className="text-neutral-400 uppercase">
                      ADD <strong className="text-white">₨{remainingForFreeShipping.toLocaleString()}</strong> MORE FOR FREE NATIONWIDE DELIVERY ALL OVER PAKISTAN
                    </span>
                  )}
                  <span className="text-neutral-500">{Math.round(freeShippingProgress)}%</span>
                </div>
                <div className="w-full h-1 bg-neutral-900 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isFreeShipping ? "bg-emerald-400" : "bg-neutral-500"
                    }`}
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Scrollable Cart Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize}`}
                    className="flex gap-4 border-b border-neutral-900/60 pb-6"
                  >
                    {/* Item Image */}
                    <div className="w-20 h-20 aspect-square bg-neutral-950 rounded overflow-hidden border border-neutral-900 flex-shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-display font-bold text-xs tracking-wider text-white uppercase leading-snug">
                            {item.product.name}
                          </h4>
                          <span className="font-mono text-xs text-white font-medium">
                            ₨{(item.product.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                        <span className="inline-block bg-neutral-900 text-neutral-400 font-mono text-[9px] tracking-widest px-2 py-0.5 rounded">
                          SIZE: {item.selectedSize}
                        </span>
                      </div>

                      {/* Item Quantity and Delete controls */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center bg-neutral-950 rounded border border-neutral-900">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity - 1)}
                            className="p-1.5 text-neutral-500 hover:text-white transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 font-mono text-[11px] text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
                            className="p-1.5 text-neutral-500 hover:text-white transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                          className="p-1.5 text-neutral-500 hover:text-rose-400 transition-colors"
                          aria-label={`Remove ${item.product.name} from bag`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promotion entry, Subtotal and Checkout blocks */}
              <div className="bg-neutral-950 border-t border-neutral-900 p-6 space-y-6">
                
                {/* Promo Code Input Form */}
                {appliedPromo ? (
                  <div className="flex items-center justify-between bg-neutral-900/60 p-3 rounded border border-neutral-800">
                    <div className="flex items-center gap-2">
                      <Flame className="w-3.5 h-3.5 text-neutral-400" />
                      <span className="font-mono text-[10px] text-white tracking-widest font-bold uppercase">
                        {appliedPromo} APPLIED (-20%)
                      </span>
                    </div>
                    <button
                      onClick={handleRemovePromo}
                      className="font-mono text-[9px] text-neutral-500 hover:text-rose-400 uppercase tracking-widest"
                    >
                      REMOVE
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="space-y-1.5">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => {
                          setPromoCode(e.target.value);
                          setPromoError("");
                        }}
                        placeholder="ENTER COUPON CODE (E.G. METAL20)"
                        className="flex-grow bg-[#0B0B0D] border border-neutral-900 rounded text-xs font-mono tracking-widest text-white uppercase px-3 py-2.5 focus:border-neutral-600 focus:ring-0 outline-none"
                      />
                      <button
                        type="submit"
                        className="bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-[10px] tracking-widest font-bold px-4 rounded border border-neutral-800 transition-colors uppercase"
                      >
                        APPLY
                      </button>
                    </div>
                    {promoError && (
                      <p className="font-mono text-[9px] text-rose-500 tracking-wider uppercase">
                        {promoError}
                      </p>
                    )}
                  </form>
                )}

                {/* Subtotal Calculations list */}
                <div className="space-y-2 text-xs font-mono uppercase text-neutral-400">
                  <div className="flex justify-between">
                    <span>BAG SUBTOTAL</span>
                    <span className="text-white">₨{subtotal.toLocaleString()}</span>
                  </div>
                  
                  {appliedPromo && (
                    <div className="flex justify-between text-emerald-400">
                      <span>VIP DISCOUNT (20%)</span>
                      <span>-₨{discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>DELIVERY CHARGES</span>
                    <span className="text-white">
                      {shippingCost === 0 ? "FREE" : `₨${shippingCost.toLocaleString()}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm text-white font-bold border-t border-neutral-900 pt-3 mt-1">
                    <span>FINAL TOTAL (COD)</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 via-white to-neutral-400">
                      ₨{total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Checkout Trigger button */}
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full bg-gradient-to-r from-neutral-700 via-neutral-100 to-neutral-600 p-[1px] rounded-sm group focus-visible:outline-white"
                >
                  <span className="w-full h-full bg-[#0B0B0D] group-hover:bg-neutral-950 text-white group-hover:text-neutral-100 font-mono text-[11px] font-bold tracking-[0.25em] uppercase py-4 rounded-sm transition-all duration-300 flex items-center justify-center gap-2">
                    PROCEED TO CHECKOUT
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </div>
            </>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
