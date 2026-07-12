import { useState, useEffect, FormEvent } from "react";
import { Search, User, ShoppingBag, Menu, X, ArrowRight, ChevronRight } from "lucide-react";
import { useCart } from "./CartContext";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { useRouter, Link } from "./Router";

export default function Header() {
  const { cart, setIsCartOpen, searchQuery, setSearchQuery, user, setUser, logout } = useCart();
  const { route, navigate } = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { scrollY } = useScroll();
  const paddingY = useTransform(scrollY, [0, 80], ["20px", "12px"]);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  // Desktop Hover Menu States
  const [hoveredMenu, setHoveredMenu] = useState<"men" | "women" | null>(null);

  // Mobile Menu Accordion States
  const [isMobileMenExpanded, setIsMobileMenExpanded] = useState(false);
  const [isMobileWomenExpanded, setIsMobileWomenExpanded] = useState(false);

  // Account tab state: 'login' | 'signup'
  const [accountTab, setAccountTab] = useState<"login" | "signup">("login");
  
  // Login input states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Signup input states
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupStreet, setSignupStreet] = useState("");
  const [signupCity, setSignupCity] = useState("");
  const [signupProvince, setSignupProvince] = useState("Sindh");
  const [signupPostal, setSignupPostal] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  // Manage body scroll lock and escape key close for drawers
  useEffect(() => {
    const active = isMobileMenuOpen || isAccountOpen;
    if (active) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsMobileMenuOpen(false);
          setIsAccountOpen(false);
        }
      };

      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isMobileMenuOpen, isAccountOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle path-aware section scrolling
  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    if (window.location.pathname !== "/" && window.location.pathname !== "/store") {
      // Set section target in session and navigate home
      sessionStorage.setItem("scrollTarget", id);
      navigate("/");
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of fixed header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // Listen to home load to scroll if targeted from another route
  useEffect(() => {
    if (route === "/" || route === "/store") {
      const target = sessionStorage.getItem("scrollTarget");
      if (target) {
        sessionStorage.removeItem("scrollTarget");
        setTimeout(() => {
          const element = document.getElementById(target);
          if (element) {
            const offset = 80;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth"
            });
          }
        }, 300);
      }
    }
  }, [route]);

  const handleLogoClick = () => {
    if (window.location.pathname !== "/" && window.location.pathname !== "/store") {
      navigate("/");
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (loginEmail.trim()) {
      setUser({
        name: loginEmail.split("@")[0].toUpperCase(),
        email: loginEmail,
        phone: "03001234567",
        address: {
          street: "Main Street, House 42",
          city: "Mirpur Khas",
          province: "Sindh",
          postalCode: "69000"
        }
      });
      setLoginEmail("");
      setLoginPassword("");
    }
  };

  const handleSignup = (e: FormEvent) => {
    e.preventDefault();
    if (signupEmail.trim() && signupName.trim()) {
      setUser({
        name: signupName,
        email: signupEmail,
        phone: signupPhone,
        address: {
          street: signupStreet,
          city: signupCity,
          province: signupProvince,
          postalCode: signupPostal
        }
      });
      setSignupName("");
      setSignupEmail("");
      setSignupPhone("");
      setSignupStreet("");
      setSignupCity("");
      setSignupProvince("Sindh");
      setSignupPostal("");
      setSignupPassword("");
    }
  };

  return (
    <>
      <motion.header
        style={{
          backgroundColor: "transparent",
          backdropFilter: "none",
          borderBottom: "none",
          paddingTop: paddingY,
          paddingBottom: paddingY,
        }}
        className="fixed top-0 left-0 right-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 text-neutral-400 hover:text-white focus-visible:outline-neutral-400 rounded-md"
            aria-label="Open mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Navigation Items (Left - Desktop) */}
          <nav className="hidden lg:flex items-center gap-8">
            {/* MEN category button & mega dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setHoveredMenu("men")}
              onMouseLeave={() => setHoveredMenu(null)}
            >
              <button
                onFocus={() => setHoveredMenu("men")}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setHoveredMenu(null);
                  }
                }}
                className={`text-[11px] font-display font-medium tracking-[0.2em] transition-all duration-300 focus-visible:outline-neutral-400 px-1 py-1 ${
                  route.startsWith("/men")
                    ? "text-white font-bold"
                    : "text-neutral-400 hover:text-white"
                }`}
                aria-haspopup="true"
                aria-expanded={hoveredMenu === "men"}
              >
                MEN
              </button>

              <AnimatePresence>
                {hoveredMenu === "men" && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-[#0D0D11]/90 backdrop-blur-xl border border-neutral-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.85)] rounded-2xl p-5 z-50 flex flex-col gap-1.5"
                    role="menu"
                    aria-label="Men Categories"
                  >
                    {[
                      { slug: "tshirts", name: "T-Shirts" },
                      { slug: "baggy-tshirts", name: "Baggy T-Shirts" },
                      { slug: "polo-shirts", name: "Polo Shirts" },
                      { slug: "pants", name: "Pants" },
                      { slug: "baggy-pants", name: "Baggy Pants" }
                    ].map((item) => {
                      const isActive = route === `/men/${item.slug}`;
                      return (
                        <Link
                          key={item.slug}
                          href={`/men/${item.slug}`}
                          onClick={() => setHoveredMenu(null)}
                          className={`group w-full text-left px-4 py-3 text-[10px] font-mono tracking-widest uppercase rounded-lg transition-all duration-200 flex items-center justify-between ${
                            isActive
                              ? "bg-white/10 text-white font-bold border-l-2 border-white"
                              : "text-neutral-400 hover:text-white hover:bg-white/5"
                          }`}
                          role="menuitem"
                        >
                          <span>{item.name}</span>
                          <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* WOMEN category button & mega dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setHoveredMenu("women")}
              onMouseLeave={() => setHoveredMenu(null)}
            >
              <button
                onFocus={() => setHoveredMenu("women")}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setHoveredMenu(null);
                  }
                }}
                className={`text-[11px] font-display font-medium tracking-[0.2em] transition-all duration-300 focus-visible:outline-neutral-400 px-1 py-1 ${
                  route.startsWith("/women")
                    ? "text-white font-bold"
                    : "text-neutral-400 hover:text-white"
                }`}
                aria-haspopup="true"
                aria-expanded={hoveredMenu === "women"}
              >
                WOMEN
              </button>

              <AnimatePresence>
                {hoveredMenu === "women" && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-[#0D0D11]/90 backdrop-blur-xl border border-neutral-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.85)] rounded-2xl p-5 z-50 flex flex-col gap-1.5"
                    role="menu"
                    aria-label="Women Categories"
                  >
                    {[
                      { slug: "tshirts", name: "T-Shirts" },
                      { slug: "baggy-tshirts", name: "Baggy T-Shirts" },
                      { slug: "polo-shirts", name: "Polo Shirts" },
                      { slug: "pants", name: "Pants" },
                      { slug: "baggy-pants", name: "Baggy Pants" }
                    ].map((item) => {
                      const isActive = route === `/women/${item.slug}`;
                      return (
                        <Link
                          key={item.slug}
                          href={`/women/${item.slug}`}
                          onClick={() => setHoveredMenu(null)}
                          className={`group w-full text-left px-4 py-3 text-[10px] font-mono tracking-widest uppercase rounded-lg transition-all duration-200 flex items-center justify-between ${
                            isActive
                              ? "bg-white/10 text-white font-bold border-l-2 border-white"
                              : "text-neutral-400 hover:text-white hover:bg-white/5"
                          }`}
                          role="menuitem"
                        >
                          <span>{item.name}</span>
                          <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => scrollToSection("shop-the-drop")}
              className="text-[11px] font-display font-medium tracking-[0.2em] text-neutral-400 hover:text-white hover:tracking-[0.25em] transition-all duration-300 focus-visible:outline-neutral-400 px-1 py-1"
            >
              SHOP
            </button>
            <button
              onClick={() => scrollToSection("shop-the-drop")}
              className="text-[11px] font-display font-medium tracking-[0.2em] text-neutral-400 hover:text-white hover:tracking-[0.25em] transition-all duration-300 focus-visible:outline-neutral-400 px-1 py-1"
            >
              DROPS
            </button>
            <button
              onClick={() => scrollToSection("our-story")}
              className="text-[11px] font-display font-medium tracking-[0.2em] text-neutral-400 hover:text-white hover:tracking-[0.25em] transition-all duration-300 focus-visible:outline-neutral-400 px-1 py-1"
            >
              STORY
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-[11px] font-display font-medium tracking-[0.2em] text-neutral-400 hover:text-white hover:tracking-[0.25em] transition-all duration-300 focus-visible:outline-neutral-400 px-1 py-1"
            >
              CONTACT
            </button>
          </nav>

          {/* Liquid Metal Monogram Logo (Center) */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
            <button
              onClick={handleLogoClick}
              className="relative flex items-center gap-2 px-3 py-1 group focus-visible:outline-neutral-400 rounded-md"
            >
              {/* Brushed-chrome logo badge */}
              <div className="relative w-14 h-14 rounded-md bg-gradient-to-br from-neutral-800 via-neutral-200 to-neutral-700 p-[1px] shadow-lg overflow-hidden flex items-center justify-center">
                {/* Diagonal sweep light sheen inside badge */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full rotate-[30deg] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out z-10" />
                <div className="w-full h-full bg-[#0D0D11] rounded-md overflow-hidden flex items-center justify-center">
                  <img 
                    src="/logo.jpeg" 
                    alt="3D THREADZ Brand Logo"
                    className="w-full h-full object-cover scale-[1.05]"
                  />
                </div>
              </div>
              <span className="hidden sm:inline-block font-hero-funky font-black text-[15px] tracking-[0.25em] text-white">
                3D THREADZ
              </span>
            </button>
          </div>

          {/* Action Icons (Right) */}
          <div className="flex items-center gap-2 lg:gap-4">
            {/* Search Icon Trigger */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`p-2 rounded-full transition-all duration-200 focus-visible:outline-neutral-400 ${
                isSearchOpen ? "text-white bg-neutral-900" : "text-neutral-400 hover:text-white"
              }`}
              aria-label="Toggle search bar"
            >
              <Search className="w-4.5 h-4.5" />
            </button>

            {/* Account Icon Trigger */}
            <button
              onClick={() => setIsAccountOpen(true)}
              className="p-2 text-neutral-400 hover:text-white transition-colors focus-visible:outline-neutral-400 rounded-full"
              aria-label="Open account details"
            >
              <User className="w-4.5 h-4.5" />
            </button>

            {/* Shopping Bag Trigger with dynamic badge count */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-neutral-400 hover:text-white transition-colors focus-visible:outline-neutral-400 rounded-full"
              aria-label={`Open shopping cart — ${totalCartItems} items in bag`}
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              {totalCartItems > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-white text-[#0B0B0D] text-[9px] font-mono font-bold flex items-center justify-center rounded-full scale-95 animate-pulse">
                  {totalCartItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Dynamic Search Dropdown */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-neutral-950 border-b border-neutral-900 overflow-hidden"
            >
              <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
                <Search className="w-5 h-5 text-neutral-500 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="SEARCH FOR OVERSIZED TEES, DROPS, INKS..."
                  className="w-full bg-transparent text-sm font-mono tracking-widest text-white border-none outline-none focus:ring-0 placeholder:text-neutral-600 py-2 uppercase"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-xs font-mono text-neutral-500 hover:text-white uppercase tracking-wider"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="text-neutral-400 hover:text-white p-1 rounded"
                  aria-label="Close search overlay"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Slide-In Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-50"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-graphite-dark border-r border-neutral-900 p-8 flex flex-col justify-between z-[55] overflow-y-auto"
            >
              <div>
                {/* Header inside drawer */}
                <div className="flex items-center justify-between mb-12">
                  <div className="flex items-center gap-2">
                    <div className="w-11 h-11 rounded bg-gradient-to-br from-neutral-800 via-neutral-200 to-neutral-700 p-[1px] flex items-center justify-center font-display font-bold text-xs tracking-wider overflow-hidden">
                      <div className="w-full h-full bg-[#0D0D11] rounded overflow-hidden flex items-center justify-center">
                        <img 
                          src="/logo.jpeg" 
                          alt="3D THREADZ Brand Logo"
                          className="w-full h-full object-cover scale-[1.05]"
                        />
                      </div>
                    </div>
                    <span className="font-hero-funky font-black text-[13px] tracking-[0.2em] text-white">
                      3D THREADZ
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-neutral-400 hover:text-white rounded focus-visible:outline-neutral-400"
                    aria-label="Close mobile menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Nav Links */}
                <div className="flex flex-col gap-6 font-display font-bold text-lg tracking-[0.15em] text-neutral-300">
                  {/* MEN collapsible mobile submenu */}
                  <div className="flex flex-col">
                    <button
                      onClick={() => setIsMobileMenExpanded(!isMobileMenExpanded)}
                      className="flex items-center justify-between py-2 text-left hover:text-white group w-full"
                    >
                      <span>MEN</span>
                      <motion.span
                        animate={{ rotate: isMobileMenExpanded ? 90 : 0 }}
                        className="text-neutral-500"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </motion.span>
                    </button>
                    <AnimatePresence>
                      {isMobileMenExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden pl-4 flex flex-col gap-3.5 font-mono text-[11px] tracking-widest text-neutral-400 mt-2 border-l border-neutral-800"
                        >
                          {[
                            { slug: "tshirts", name: "T-Shirts" },
                            { slug: "baggy-tshirts", name: "Baggy T-Shirts" },
                            { slug: "polo-shirts", name: "Polo Shirts" },
                            { slug: "pants", name: "Pants" },
                            { slug: "baggy-pants", name: "Baggy Pants" }
                          ].map((item) => (
                            <Link
                              key={item.slug}
                              href={`/men/${item.slug}`}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="py-1 hover:text-white transition-colors block"
                            >
                              {item.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* WOMEN collapsible mobile submenu */}
                  <div className="flex flex-col">
                    <button
                      onClick={() => setIsMobileWomenExpanded(!isMobileWomenExpanded)}
                      className="flex items-center justify-between py-2 text-left hover:text-white group w-full"
                    >
                      <span>WOMEN</span>
                      <motion.span
                        animate={{ rotate: isMobileWomenExpanded ? 90 : 0 }}
                        className="text-neutral-500"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </motion.span>
                    </button>
                    <AnimatePresence>
                      {isMobileWomenExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden pl-4 flex flex-col gap-3.5 font-mono text-[11px] tracking-widest text-neutral-400 mt-2 border-l border-neutral-800"
                        >
                          {[
                            { slug: "tshirts", name: "T-Shirts" },
                            { slug: "baggy-tshirts", name: "Baggy T-Shirts" },
                            { slug: "polo-shirts", name: "Polo Shirts" },
                            { slug: "pants", name: "Pants" },
                            { slug: "baggy-pants", name: "Baggy Pants" }
                          ].map((item) => (
                            <Link
                              key={item.slug}
                              href={`/women/${item.slug}`}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="py-1 hover:text-white transition-colors block"
                            >
                              {item.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <button
                    onClick={() => scrollToSection("shop-the-drop")}
                    className="flex items-center justify-between py-2 text-left hover:text-white group"
                  >
                    <span>SHOP</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                  <button
                    onClick={() => scrollToSection("shop-the-drop")}
                    className="flex items-center justify-between py-2 text-left hover:text-white group"
                  >
                    <span>NEW DROPS</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                  <button
                    onClick={() => scrollToSection("our-story")}
                    className="flex items-center justify-between py-2 text-left hover:text-white group"
                  >
                    <span>OUR STORY</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                  <button
                    onClick={() => scrollToSection("contact")}
                    className="flex items-center justify-between py-2 text-left hover:text-white group"
                  >
                    <span>CONTACT</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </div>
              </div>

              {/* Drawer Footer info */}
              <div className="border-t border-neutral-900 pt-6 mt-12">
                <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-2">
                  MEMBER ARCHIVE
                </p>
                <p className="text-xs text-neutral-400 mb-4">
                  Unlock priority drop alerts & members-only archive restocks.
                </p>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsAccountOpen(true);
                  }}
                  className="w-full bg-neutral-900 border border-neutral-800 text-white font-mono text-[11px] tracking-widest py-3 text-center uppercase hover:bg-neutral-800 transition-colors focus-visible:outline-neutral-400 rounded"
                >
                  JOIN CLUB
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* User Account Slider Drawer */}
      <AnimatePresence>
        {isAccountOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAccountOpen(false)}
              className="fixed inset-0 bg-black z-50"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
              className="fixed inset-y-0 right-0 w-96 max-w-[90vw] bg-graphite-dark border-l border-neutral-900 p-8 flex flex-col justify-between z-[55] overflow-y-auto"
            >
              <div>
                <div className="flex items-center justify-between mb-8 border-b border-neutral-900 pb-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4.5 h-4.5 text-neutral-400" />
                    <span className="font-display font-bold text-xs tracking-widest text-white uppercase">
                      3DT ARCHIVE ACCESS
                    </span>
                  </div>
                  <button
                    onClick={() => setIsAccountOpen(false)}
                    className="p-1 text-neutral-400 hover:text-white rounded"
                    aria-label="Close profile drawer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {user ? (
                  <div className="space-y-6">
                    <div className="bg-[#0D0D11] p-6 rounded border border-neutral-900 space-y-4">
                      <div>
                        <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest mb-1">
                          VIP MEMBER ARCHIVE
                        </p>
                        <h4 className="font-display font-bold text-white text-base tracking-wider">
                          {user.name}
                        </h4>
                        <p className="text-xs text-neutral-400 font-mono mt-0.5">{user.email}</p>
                      </div>
                      
                      <div className="border-t border-neutral-900 pt-3 space-y-2 text-xs">
                        <div>
                          <span className="text-neutral-500 block font-mono text-[9px] uppercase tracking-wider">CONTACT NUMBER</span>
                          <span className="text-neutral-300 font-sans">{user.phone}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 block font-mono text-[9px] uppercase tracking-wider">DELIVERY DESTINATION</span>
                          <span className="text-neutral-300 font-sans">
                            {user.address.street}, {user.address.city}, {user.address.province} {user.address.postalCode}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                        <span className="text-[10px] font-mono text-emerald-400 tracking-wider uppercase">
                          VIP ARCHIVE BENEFITS ACTIVE
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h5 className="font-display font-medium text-xs tracking-widest text-neutral-400 uppercase">
                        YOUR VIP ORDER CODES
                      </h5>
                      <div className="space-y-2 font-mono text-xs">
                        <div className="flex justify-between p-3 bg-neutral-950 border border-neutral-900 rounded">
                          <span className="text-white font-bold">METAL20</span>
                          <span className="text-neutral-500">20% OFF CHROME RELEASE</span>
                        </div>
                        <div className="flex justify-between p-3 bg-neutral-950 border border-neutral-900 rounded">
                          <span className="text-white font-bold">VIP_SHIPPING</span>
                          <span className="text-neutral-500">FREE TCS NATIONWIDE DELIVERY</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={logout}
                      className="w-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 font-mono text-[11px] tracking-widest py-3 uppercase transition-colors rounded"
                    >
                      LOGOUT SECURE SESSION
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6 flex-1 flex flex-col overflow-hidden">
                    {/* Tab Navigation */}
                    <div className="flex border-b border-neutral-900">
                      <button
                        onClick={() => setAccountTab("login")}
                        className={`flex-1 pb-3 text-[11px] font-mono tracking-widest uppercase border-b-2 transition-all duration-300 ${
                          accountTab === "login"
                            ? "text-white border-white font-bold"
                            : "text-neutral-500 border-transparent hover:text-white"
                        }`}
                      >
                        LOG IN
                      </button>
                      <button
                        onClick={() => setAccountTab("signup")}
                        className={`flex-1 pb-3 text-[11px] font-mono tracking-widest uppercase border-b-2 transition-all duration-300 ${
                          accountTab === "signup"
                            ? "text-white border-white font-bold"
                            : "text-neutral-500 border-transparent hover:text-white"
                        }`}
                      >
                        SIGN UP
                      </button>
                    </div>

                    {accountTab === "login" ? (
                      <form onSubmit={handleLogin} className="space-y-4">
                        <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
                          Enter your credentials to access your orders and premium streetwear benefits.
                        </p>
                        <div>
                          <label className="block text-[9px] font-mono text-neutral-500 uppercase tracking-widest mb-1.5">
                            EMAIL ADDRESS
                          </label>
                          <input
                            type="email"
                            required
                            autoComplete="email"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            placeholder="ENTER YOUR EMAIL"
                            className="w-full bg-neutral-950 border border-neutral-800 text-white font-mono text-xs p-3 focus:border-neutral-500 focus:ring-0 outline-none rounded placeholder:text-neutral-700"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-mono text-neutral-500 uppercase tracking-widest mb-1.5">
                            PASSWORD
                          </label>
                          <input
                            type="password"
                            required
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            placeholder="ENTER PASSWORD"
                            className="w-full bg-neutral-950 border border-neutral-800 text-white font-mono text-xs p-3 focus:border-neutral-500 focus:ring-0 outline-none rounded placeholder:text-neutral-700"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-white hover:bg-neutral-200 text-[#0B0B0D] font-mono text-[11px] tracking-widest font-bold py-3 uppercase transition-all duration-300 rounded"
                        >
                          LOG IN
                        </button>
                      </form>
                    ) : (
                      <form onSubmit={handleSignup} className="space-y-4 overflow-y-auto pr-1 max-h-[50vh] no-scrollbar">
                        <div>
                          <label className="block text-[9px] font-mono text-neutral-500 uppercase tracking-widest mb-1">
                            FULL NAME
                          </label>
                          <input
                            type="text"
                            required
                            value={signupName}
                            onChange={(e) => setSignupName(e.target.value)}
                            placeholder="ENTER NAME"
                            className="w-full bg-neutral-950 border border-neutral-800 text-white font-mono text-xs p-2.5 focus:border-neutral-500 outline-none rounded placeholder:text-neutral-700"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-mono text-neutral-500 uppercase tracking-widest mb-1">
                            EMAIL ADDRESS
                          </label>
                          <input
                            type="email"
                            required
                            autoComplete="email"
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                            placeholder="ENTER EMAIL"
                            className="w-full bg-neutral-950 border border-neutral-800 text-white font-mono text-xs p-2.5 focus:border-neutral-500 outline-none rounded placeholder:text-neutral-700"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-mono text-neutral-500 uppercase tracking-widest mb-1">
                            PHONE NUMBER
                          </label>
                          <input
                            type="tel"
                            required
                            pattern="[0-9+]{10,13}"
                            value={signupPhone}
                            onChange={(e) => setSignupPhone(e.target.value)}
                            placeholder="E.G. 03353162656"
                            className="w-full bg-neutral-950 border border-neutral-800 text-white font-mono text-xs p-2.5 focus:border-neutral-500 outline-none rounded placeholder:text-neutral-700"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-mono text-neutral-500 uppercase tracking-widest mb-1">
                            STREET ADDRESS
                          </label>
                          <input
                            type="text"
                            required
                            value={signupStreet}
                            onChange={(e) => setSignupStreet(e.target.value)}
                            placeholder="HOUSE #, BLOCK, STREET NAME"
                            className="w-full bg-neutral-950 border border-neutral-800 text-white font-mono text-xs p-2.5 focus:border-neutral-500 outline-none rounded placeholder:text-neutral-700"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[9px] font-mono text-neutral-500 uppercase tracking-widest mb-1">
                              CITY
                            </label>
                            <input
                              type="text"
                              required
                              value={signupCity}
                              onChange={(e) => setSignupCity(e.target.value)}
                              placeholder="E.G. KARACHI"
                              className="w-full bg-neutral-950 border border-neutral-800 text-white font-mono text-xs p-2.5 focus:border-neutral-500 outline-none rounded placeholder:text-neutral-700"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-mono text-neutral-500 uppercase tracking-widest mb-1">
                              PROVINCE
                            </label>
                            <select
                              value={signupProvince}
                              onChange={(e) => setSignupProvince(e.target.value)}
                              className="w-full bg-neutral-950 border border-neutral-800 text-white font-mono text-xs p-2.5 focus:border-neutral-500 outline-none rounded"
                            >
                              <option value="Sindh">Sindh</option>
                              <option value="Punjab">Punjab</option>
                              <option value="Khyber Pakhtunkhwa">KPK</option>
                              <option value="Balochistan">Balochistan</option>
                              <option value="Islamabad">Islamabad</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-[9px] font-mono text-neutral-500 uppercase tracking-widest mb-1">
                            POSTAL CODE
                          </label>
                          <input
                            type="text"
                            required
                            value={signupPostal}
                            onChange={(e) => setSignupPostal(e.target.value)}
                            placeholder="E.G. 75210"
                            className="w-full bg-neutral-950 border border-neutral-800 text-white font-mono text-xs p-2.5 focus:border-neutral-500 outline-none rounded placeholder:text-neutral-700"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-mono text-neutral-500 uppercase tracking-widest mb-1">
                            PASSWORD
                          </label>
                          <input
                            type="password"
                            required
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                            placeholder="CREATE PASSWORD"
                            className="w-full bg-neutral-950 border border-neutral-800 text-white font-mono text-xs p-2.5 focus:border-neutral-500 outline-none rounded placeholder:text-neutral-700"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-white hover:bg-neutral-200 text-[#0B0B0D] font-mono text-[11px] tracking-widest font-bold py-3 uppercase transition-all duration-300 rounded"
                        >
                          CREATE ACCOUNT
                        </button>
                      </form>
                    )}

                    <div className="p-4 bg-neutral-950 border border-neutral-900 rounded space-y-1">
                      <span className="text-[9px] font-mono text-neutral-400 tracking-wider font-bold block uppercase">
                        DEMO DISCOUNT CODE:
                      </span>
                      <p className="text-[10px] font-sans text-neutral-500 leading-relaxed">
                        Use <strong className="text-white">METAL20</strong> in your cart to receive 20% off.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-neutral-900 pt-4 font-mono text-[10px] text-neutral-600 uppercase tracking-widest text-center">
                SECURE SSL VERIFIED
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
