import { useState, useCallback, useEffect } from "react";
import { CartProvider, useCart } from "./components/CartContext";
import Header from "./components/Header";
import Hero from "./components/Hero";
import CurvedLoop from "./components/CurvedLoop";
import ProductRail from "./components/ProductRail";
import Storytelling from "./components/Storytelling";
import QualityDetails from "./components/QualityDetails";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import ProductQuickView from "./components/ProductQuickView";
import StickyMobileBar from "./components/StickyMobileBar";
import CustomCursor from "./components/CustomCursor";
import Preloader from "./components/Preloader";
import CheckoutPage from "./components/CheckoutPage";
import CategoryPage from "./components/CategoryPage";
import { RouterProvider, useRouter, PageWrapper } from "./components/Router";
import { motion, AnimatePresence } from "motion/react";

const sectionReveal = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.36,
      ease: [0.22, 1, 0.36, 1] as const,
    }
  }
};

function AppContent({ loading }: { loading: boolean }) {
  const { currentView, setCurrentView } = useCart();
  const { route, navigate } = useRouter();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Sync route changes to the existing currentView context state
  useEffect(() => {
    if (route === "/checkout" && currentView !== "checkout") {
      setCurrentView("checkout");
    } else if (route !== "/checkout" && currentView === "checkout") {
      setCurrentView("store");
    }
  }, [route, currentView, setCurrentView]);

  // Sync internal currentView state updates back to route paths
  useEffect(() => {
    if (currentView === "checkout" && route !== "/checkout") {
      navigate("/checkout");
    } else if (currentView === "store" && route === "/checkout") {
      navigate("/");
    }
  }, [currentView, route, navigate]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  const revealVariants = prefersReducedMotion ? {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.36 } }
  } : sectionReveal;

  if (loading) return null;

  const isCheckout = route === "/checkout";
  const isCategory = route.startsWith("/men/") || route.startsWith("/women/");

  return (
    <div className="relative min-h-screen bg-graphite-black flex flex-col text-neutral-100 overflow-x-hidden selection:bg-white selection:text-black">
      {/* Fixed dark navigation bar (hidden on checkout matching original design) */}
      {!isCheckout && <Header />}

      {/* Main layout page container supporting smooth slide transitions */}
      <div className="relative flex-grow flex flex-col w-full overflow-hidden">
        <AnimatePresence mode="popLayout">
          {isCheckout ? (
            <PageWrapper key="/checkout" id="/checkout">
              <CheckoutPage />
            </PageWrapper>
          ) : isCategory ? (
            <PageWrapper key={route} id={route}>
              <CategoryPage />
            </PageWrapper>
          ) : (
            <PageWrapper key="/" id="/">
              {/* Homepage content */}
              <main className="flex-grow">
                {/* Hero segment */}
                <Hero />

                {/* Scrolling curved marquee loop */}
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={revealVariants}
                >
                  <div className="relative w-full overflow-hidden bg-neutral-950 border-y border-neutral-900/60 py-6 md:py-8 select-none">
                    <div className="absolute top-0 bottom-0 left-0 w-16 md:w-32 bg-gradient-to-r from-neutral-950 to-transparent z-10 pointer-events-none" />
                    <div className="absolute top-0 bottom-0 right-0 w-16 md:w-32 bg-gradient-to-l from-neutral-950 to-transparent z-10 pointer-events-none" />
                    <CurvedLoop
                      marqueeText="3D THREADZ • PREMIUM STREETWEAR • MADE IN PAKISTAN • CUSTOM APPAREL • PREMIUM QUALITY • FAST DELIVERY • WEAR CONFIDENCE • OWN THE STREETS • "
                      speed={1.8}
                      curveAmount={115}
                      direction="left"
                      interactive={true}
                      className="font-mono text-[2.2rem] md:text-[3rem] tracking-[0.2em] font-extrabold uppercase fill-white transition-colors duration-300"
                    />
                  </div>
                </motion.div>

                {/* Product drops showcase */}
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={revealVariants}
                >
                  <ProductRail />
                </motion.div>

                {/* Brand Ethos narrative flip modules */}
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={revealVariants}
                >
                  <Storytelling />
                </motion.div>

                {/* Close-up trust signal macro section */}
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={revealVariants}
                >
                  <QualityDetails />
                </motion.div>
              </main>

              {/* Premium footer */}
              <Footer />
            </PageWrapper>
          )}
        </AnimatePresence>
      </div>

      {/* Sticky mobile quick action cart bar */}
      <StickyMobileBar />

      {/* Overlays, Drawers and Interactive Popovers */}
      <CartDrawer />
      <ProductQuickView />
    </div>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  const handlePreloaderComplete = useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <CartProvider>
      <RouterProvider>
        <CustomCursor />
        <Preloader onComplete={handlePreloaderComplete} />
        <AppContent loading={loading} />
      </RouterProvider>
    </CartProvider>
  );
}
