import React, { useState, useMemo, FormEvent } from "react";
import { useCart } from "./CartContext";
import { ArrowLeft, CheckCircle, Smartphone, Truck, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function CheckoutPage() {
  const { cart, user, setUser, clearCart, setCurrentView } = useCart();

  // Local form states (initialized with user context if logged in)
  const [email, setEmail] = useState(user?.email || "");
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [street, setStreet] = useState(user?.address?.street || "");
  const [city, setCity] = useState(user?.address?.city || "");
  const [province, setProvince] = useState(user?.address?.province || "Sindh");
  const [postalCode, setPostalCode] = useState(user?.address?.postalCode || "");

  // Coupon code states
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoDiscount, setPromoDiscount] = useState(0); // decimal e.g. 0.20
  const [promoError, setPromoError] = useState("");

  // Place order states
  const [checkoutStep, setCheckoutStep] = useState<"idle" | "processing" | "success">("idle");
  const [orderRef, setOrderRef] = useState("");

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

  // Cart Math Calculations
  const cartTotals = useMemo(() => {
    const subtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
    const discountAmount = subtotal * promoDiscount;
    const discountedSubtotal = subtotal - discountAmount;
    
    const shippingThreshold = 4999;
    const isFreeShipping = discountedSubtotal >= shippingThreshold;
    const shippingCost = cart.length === 0 ? 0 : (isFreeShipping ? 0 : 200);
    const total = discountedSubtotal + shippingCost;

    return {
      subtotal,
      discountAmount,
      discountedSubtotal,
      isFreeShipping,
      shippingCost,
      total,
    };
  }, [cart, promoDiscount]);

  const { subtotal, discountAmount, discountedSubtotal, shippingCost, total } = cartTotals;

  const handleSubmitOrder = (e: FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setCheckoutStep("processing");

    // If guest completed, let's login/save them in context for convenience
    if (!user) {
      setUser({
        name,
        email,
        phone,
        address: { street, city, province, postalCode }
      });
    }

    // Simulate database placement and courier routing delay
    setTimeout(() => {
      const generatedRef = "3DT-" + Math.floor(Math.random() * 900000 + 100000);
      setOrderRef(generatedRef);
      setCheckoutStep("success");
    }, 2500);
  };

  const handleBackToStore = () => {
    if (checkoutStep === "success") {
      clearCart();
    }
    setCurrentView("store");
  };

  // Construct dynamic WhatsApp message for quick verification
  const getWhatsAppLink = () => {
    const itemsText = cart.map(item => `- ${item.product.name} (Size: ${item.selectedSize}, Qty: ${item.quantity})`).join("%0A");
    const addressText = `${street}, ${city}, ${province} (${postalCode})`;
    
    const message = `Salam 3D Threadz! I just placed a COD order on your website. Here are my details:%0A%0A*Order Reference:* ${orderRef}%0A*Name:* ${name}%0A*Phone:* ${phone}%0A*Address:* ${addressText}%0A%0A*Items:*%0A${itemsText}%0A%0A*Total Due:* ₨${total.toLocaleString()}%0A%0APlease verify and process my order. Thanks!`;
    
    return `https://wa.me/923353162656?text=${message}`;
  };

  return (
    <div className="min-h-screen bg-graphite-black text-neutral-100 font-sans pb-20 selection:bg-white selection:text-black">
      {/* Checkout Navbar */}
      <header className="border-b border-neutral-800 bg-graphite-black/95 sticky top-0 z-40 py-5">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          <button
            onClick={handleBackToStore}
            disabled={checkoutStep === "processing"}
            className="flex items-center gap-2 text-xs font-sans font-medium text-neutral-300 hover:text-white uppercase transition-colors disabled:opacity-50 disabled:pointer-events-none"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Store</span>
          </button>
          
          <div className="font-hero-funky font-black text-sm tracking-[0.25em] text-white">
            3D THREADZ
          </div>

          <div className="w-20" /> {/* Spacer for centering logo */}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-10">
        <AnimatePresence mode="wait">
          {checkoutStep === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="max-w-xl mx-auto bg-neutral-950/60 border border-neutral-800 rounded-2xl p-8 md:p-10 text-center space-y-8"
            >
              <div className="w-16 h-16 bg-neutral-900 border border-neutral-800 flex items-center justify-center rounded-full mx-auto">
                <CheckCircle className="w-8 h-8 text-white animate-bounce" />
              </div>

              <div className="space-y-3">
                <span className="font-sans text-[10px] text-emerald-400 font-bold tracking-widest uppercase block">
                  ORDER PLACED SUCCESSFULLY // CASH ON DELIVERY
                </span>
                <h2 className="font-display font-bold text-2xl md:text-3xl text-white tracking-tight uppercase">
                  CONFIDENCE SECURED.
                </h2>
                <p className="text-sm text-neutral-300 leading-relaxed max-w-sm mx-auto">
                  Thank you, <strong className="text-white">{name}</strong>. Your order is registered! To expedite shipment processing, click the button below to send your details directly to Zameer & Ali on WhatsApp.
                </p>
              </div>

              {/* Order Reference Box */}
              <div className="bg-[#0B0B0D] border border-neutral-800 rounded-lg p-5 space-y-3 font-sans text-xs text-left max-w-sm mx-auto">
                <div className="flex justify-between">
                  <span className="text-neutral-400">ORDER REF:</span>
                  <span className="text-white font-bold">{orderRef}</span>
                </div>
                <div className="flex justify-between border-t border-neutral-800 pt-2.5 mt-2.5">
                  <span className="text-neutral-400">TOTAL PAYABLE:</span>
                  <span className="text-white font-bold">₨{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">PAYMENT STATUS:</span>
                  <span className="text-emerald-400 font-bold">CASH ON DELIVERY</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 max-w-sm mx-auto">
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-sans font-bold text-xs tracking-[0.2em] py-4 rounded uppercase transition-colors text-center block"
                >
                  VERIFY VIA WHATSAPP
                </a>
                <button
                  onClick={handleBackToStore}
                  className="w-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white font-sans font-bold text-xs tracking-[0.2em] py-4 rounded uppercase transition-colors"
                >
                  CONTINUE SHOPPING
                </button>
              </div>
            </motion.div>
          ) : checkoutStep === "processing" ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-sm mx-auto py-24 text-center space-y-6"
            >
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-neutral-800" />
                <div className="absolute inset-0 rounded-full border-4 border-t-white animate-spin" />
              </div>
              <div className="space-y-2">
                <span className="font-sans text-[10px] text-neutral-400 tracking-wider block uppercase">
                  TRANSACTION DISPATCHING
                </span>
                <h3 className="font-display font-bold text-base text-white tracking-widest uppercase animate-pulse">
                  ROUTING SECURE ORDER...
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                  Please hold tight while we register your Cash on Delivery parcel details.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
            >
              {/* Left Side: Shipping Form Address details */}
              <div className="lg:col-span-7 space-y-8">
                <div className="space-y-1.5 border-b border-neutral-800 pb-5">
                  <span className="font-sans text-[10px] text-neutral-300 tracking-wider uppercase block font-semibold">
                    SHIPPING DESTINATION
                  </span>
                  <h1 className="font-display font-bold text-2xl text-white tracking-wide uppercase">
                    SECURE CHECKOUT
                  </h1>
                </div>

                <form id="checkout-form" onSubmit={handleSubmitOrder} className="space-y-6">
                  {/* Personal details */}
                  <div className="space-y-4">
                    <h3 className="font-sans text-xs text-neutral-200 tracking-wide font-bold uppercase">
                      1. CUSTOMER CONTACT
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-sans text-neutral-300 font-medium tracking-wide mb-1.5">
                          EMAIL ADDRESS
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          className="w-full bg-neutral-950 border border-neutral-800 text-white font-sans text-sm p-3 focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 outline-none rounded placeholder:text-neutral-700"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-sans text-neutral-300 font-medium tracking-wide mb-1.5">
                          FULL NAME
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your full name"
                          className="w-full bg-neutral-950 border border-neutral-800 text-white font-sans text-sm p-3 focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 outline-none rounded placeholder:text-neutral-700"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-sans text-neutral-300 font-medium tracking-wide mb-1.5">
                        PHONE NUMBER (FOR PARCEL DELIVERY CALL)
                      </label>
                      <input
                        type="tel"
                        required
                        pattern="[0-9+]{10,13}"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 03353162656"
                        className="w-full bg-neutral-950 border border-neutral-800 text-white font-sans text-sm p-3 focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 outline-none rounded placeholder:text-neutral-700"
                      />
                    </div>
                  </div>

                  {/* Shipping address details */}
                  <div className="space-y-4 pt-4 border-t border-neutral-800">
                    <h3 className="font-sans text-xs text-neutral-200 tracking-wide font-bold uppercase">
                      2. DELIVERY DETAILS
                    </h3>
                    <div>
                      <label className="block text-[11px] font-sans text-neutral-300 font-medium tracking-wide mb-1.5">
                        STREET ADDRESS (HOUSE #, SECTOR, BLOCK, APARTMENT)
                      </label>
                      <input
                        type="text"
                        required
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        placeholder="House number, street address, block, area"
                        className="w-full bg-neutral-950 border border-neutral-800 text-white font-sans text-sm p-3 focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 outline-none rounded placeholder:text-neutral-700"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-1">
                        <label className="block text-[11px] font-sans text-neutral-300 font-medium tracking-wide mb-1.5">
                          CITY
                        </label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="e.g. Karachi"
                          className="w-full bg-neutral-950 border border-neutral-800 text-white font-sans text-sm p-3 focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 outline-none rounded placeholder:text-neutral-700"
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label className="block text-[11px] font-sans text-neutral-300 font-medium tracking-wide mb-1.5">
                          PROVINCE
                        </label>
                        <select
                          value={province}
                          onChange={(e) => setProvince(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-800 text-white font-sans text-sm p-3 focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 outline-none rounded"
                        >
                          <option value="Sindh">Sindh</option>
                          <option value="Punjab">Punjab</option>
                          <option value="Khyber Pakhtunkhwa">KPK</option>
                          <option value="Balochistan">Balochistan</option>
                          <option value="Islamabad">Islamabad</option>
                        </select>
                      </div>
                      <div className="md:col-span-1">
                        <label className="block text-[11px] font-sans text-neutral-300 font-medium tracking-wide mb-1.5">
                          POSTAL CODE
                        </label>
                        <input
                          type="text"
                          required
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          placeholder="e.g. 75210"
                          className="w-full bg-neutral-950 border border-neutral-800 text-white font-sans text-sm p-3 focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 outline-none rounded placeholder:text-neutral-700"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment method section */}
                  <div className="space-y-4 pt-4 border-t border-neutral-800">
                    <h3 className="font-sans text-xs text-neutral-200 tracking-wide font-bold uppercase">
                      3. PAYMENT PROTOCOL
                    </h3>
                    
                    {/* COD Only Info Box */}
                    <div className="p-5 bg-[#0A0A0C] border border-neutral-800 rounded-xl space-y-4">
                      <div className="flex items-start gap-3">
                        <Smartphone className="w-5 h-5 text-neutral-300 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-display font-bold text-xs text-white uppercase tracking-wider">
                            CASH ON DELIVERY (COD) ONLY
                          </h4>
                          <p className="text-[11px] text-neutral-300 leading-relaxed font-sans mt-1">
                            We currently exclusively support Cash on Delivery to guarantee full customer peace of mind. Pay cash directly to the courier agent when your package is handed over at your doorstep.
                          </p>
                        </div>
                      </div>

                      {/* Card Disabled Warning */}
                      <div className="flex items-start gap-3 border-t border-neutral-800/80 pt-3">
                        <CreditCard className="w-5 h-5 text-rose-500 shrink-0 mt-0.5 opacity-70" />
                        <div>
                          <h4 className="font-display font-bold text-xs text-rose-400 uppercase tracking-wider">
                            CARD TRANSACTIONS SUSPENDED
                          </h4>
                          <p className="text-[11px] text-neutral-400 leading-relaxed font-sans mt-0.5">
                            Credit/Debit card options are temporarily offline. Pre-payments via bank accounts are not accepted online. Please do not trust any link asking for card credentials.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={cart.length === 0}
                    className="w-full bg-white hover:bg-neutral-200 text-[#0B0B0D] font-sans font-bold text-xs tracking-widest py-4.5 uppercase rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <span>PLACE ORDER (CASH ON DELIVERY)</span>
                  </button>
                </form>
              </div>

              {/* Right Side: Cart Summary Details */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-[#121215]/40 backdrop-blur-md rounded-2xl border border-neutral-800 p-6 md:p-8 space-y-6">
                  <h3 className="font-display font-bold text-sm tracking-widest text-white uppercase pb-4 border-b border-neutral-800">
                    YOUR CURATED ITEMS
                  </h3>

                  {cart.length === 0 ? (
                    <div className="text-center py-10 space-y-2">
                      <p className="font-sans text-xs text-neutral-300 tracking-wider">
                        NO ITEMS IN CART
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
                      {cart.map((item) => (
                        <div
                          key={`${item.product.id}-${item.selectedSize}`}
                          className="flex gap-3 justify-between items-center text-xs"
                        >
                          <div className="flex gap-3 items-center min-w-0">
                            <div className="w-12 h-12 rounded overflow-hidden border border-neutral-800 shrink-0 bg-neutral-950">
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-display font-bold text-[11px] text-white tracking-wider truncate uppercase">
                                {item.product.name}
                              </h4>
                              <p className="font-sans text-[10px] text-neutral-300 mt-0.5">
                                SIZE: {item.selectedSize} // QTY: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <span className="font-sans text-white font-medium">
                            ₨{(item.product.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Promo Input */}
                  {!appliedPromo ? (
                    <form onSubmit={handleApplyPromo} className="pt-4 border-t border-neutral-800">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => {
                            setPromoCode(e.target.value);
                            setPromoError("");
                          }}
                          placeholder="Coupon Code"
                          className="flex-grow bg-[#0B0B0D] border border-neutral-800 rounded text-xs font-sans tracking-widest text-white uppercase px-3 py-2.5 outline-none focus:border-neutral-500"
                        />
                        <button
                          type="submit"
                          className="bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-white font-sans text-[10px] tracking-widest px-4 rounded transition-colors uppercase"
                        >
                          APPLY
                        </button>
                      </div>
                      {promoError && (
                        <p className="font-sans text-[10px] text-rose-500 tracking-wider uppercase mt-1">
                          {promoError}
                        </p>
                      )}
                    </form>
                  ) : (
                    <div className="flex items-center justify-between bg-neutral-900/40 p-3 rounded border border-neutral-800 text-xs">
                      <span className="font-sans text-[10px] text-white tracking-widest uppercase">
                        CODE {appliedPromo} APPLIED (-20%)
                      </span>
                      <button
                        onClick={handleRemovePromo}
                        className="font-sans text-[10px] text-neutral-400 hover:text-rose-450 uppercase tracking-widest"
                      >
                        REMOVE
                      </button>
                    </div>
                  )}

                  {/* Calculations breakdown */}
                  <div className="space-y-2.5 text-xs font-sans uppercase text-neutral-200 pt-4 border-t border-neutral-800">
                    <div className="flex justify-between">
                      <span>ITEMS SUB-TOTAL</span>
                      <span className="text-white">₨{subtotal.toLocaleString()}</span>
                    </div>
                    {appliedPromo && (
                      <div className="flex justify-between text-emerald-400 font-semibold">
                        <span>COUPON DISCOUNT</span>
                        <span>-₨{discountAmount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>SHIPPING FEE (TCS)</span>
                      <span className="text-white">
                        {shippingCost === 0 ? "FREE" : `₨${shippingCost.toLocaleString()}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-white font-bold pt-3 mt-1 border-t border-neutral-800">
                      <span>TOTAL DUE (COD)</span>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 via-white to-neutral-400">
                        ₨{total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Delivery details message */}
                  <div className="flex items-start gap-2 bg-[#0B0B0D] p-3.5 border border-neutral-800 rounded text-[10px] text-neutral-300 font-sans leading-relaxed">
                    <Truck className="w-4 h-4 text-neutral-300 shrink-0 mt-0.5" />
                    <p>
                      Standard shipping time takes 2-4 working days. Delivery courier partners: leopards Express, TCS, or Trax Courier.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
