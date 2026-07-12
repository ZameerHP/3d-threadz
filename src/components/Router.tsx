import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { motion, useIsPresent } from "motion/react";

interface RouterContextType {
  route: string;
  navigate: (path: string) => void;
  previousScrollY: number;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export function RouterProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState(window.location.pathname);
  const [previousScrollY, setPreviousScrollY] = useState(0);

  useEffect(() => {
    const handlePopState = () => {
      setRoute(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (window.location.pathname === path) return;
    
    // Capture scroll before navigating
    setPreviousScrollY(window.scrollY);
    
    window.history.pushState(null, "", path);
    setRoute(path);
  };

  return (
    <RouterContext.Provider value={{ route, navigate, previousScrollY }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("useRouter must be used within a RouterProvider");
  }
  return context;
}

interface LinkProps {
  href: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  [key: string]: any;
}

export function Link({ href, className, children, onClick, ...props }: LinkProps) {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) onClick();
    navigate(href);
  };

  return (
    <a href={href} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
}

const pageVariants = {
  initial: {
    x: "100%",
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.55,
      ease: [0.65, 0, 0.35, 1] as const, // Ease-in-out cubic
    },
  },
  exit: {
    x: "-100%",
    opacity: 0,
    transition: {
      duration: 0.55,
      ease: [0.65, 0, 0.35, 1] as const,
    },
  },
};

export function PageWrapper({ children, id }: { children: ReactNode; id: string }) {
  const { previousScrollY } = useRouter();
  const isPresent = useIsPresent();

  useEffect(() => {
    if (isPresent) {
      // Scroll new page to top instantly on entry
      window.scrollTo(0, 0);
    }
  }, [isPresent]);

  // Exiting elements are positioned absolutely to avoid vertical shifts/white screens
  const exitStyle: React.CSSProperties = !isPresent
    ? {
        position: "absolute",
        top: -previousScrollY,
        left: 0,
        width: "100%",
        zIndex: 10,
        pointerEvents: "none",
      }
    : {};

  return (
    <motion.div
      key={id}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={exitStyle}
      className="w-full flex-grow flex flex-col min-h-screen bg-graphite-black"
    >
      {children}
    </motion.div>
  );
}
