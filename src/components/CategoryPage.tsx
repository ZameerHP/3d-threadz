import { PRODUCTS } from "../types";
import { useRouter, Link } from "./Router";
import ProductCard from "./ProductCard";
import Footer from "./Footer";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";

const CATEGORY_NAMES: Record<string, string> = {
  "tshirts": "T-Shirts",
  "baggy-tshirts": "Baggy T-Shirts",
  "polo-shirts": "Polo Shirts",
  "pants": "Pants",
  "baggy-pants": "Baggy Pants"
};

const CATEGORIES_LIST = [
  { slug: "tshirts", name: "T-Shirts" },
  { slug: "baggy-tshirts", name: "Baggy T-Shirts" },
  { slug: "polo-shirts", name: "Polo Shirts" },
  { slug: "pants", name: "Pants" },
  { slug: "baggy-pants", name: "Baggy Pants" }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, // Stagger delay of 80ms
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as const // premium cubic ease out
    }
  }
};

export default function CategoryPage() {
  const { route } = useRouter();

  // Parse path: /men/tshirts -> gender = men, category = tshirts
  const pathParts = route.split("/").filter(Boolean);
  const gender = pathParts[0] as "men" | "women";
  const categorySlug = pathParts[1] || "tshirts";

  const genderName = gender === "men" ? "MEN" : "WOMEN";
  const categoryName = CATEGORY_NAMES[categorySlug] || "Collection";

  // Filter products matching gender and subcategory
  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesGender = product.gender === gender || product.gender === "unisex";
    const matchesCategory = product.subcategories.includes(categorySlug as any);
    return matchesGender && matchesCategory;
  });

  return (
    <div className="w-full flex-grow flex flex-col pt-32 bg-black">
      {/* Breadcrumbs / Header Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full mb-12">
        <div className="flex items-center gap-2 font-mono text-[9px] md:text-[10px] text-neutral-500 tracking-[0.25em] uppercase mb-4">
          <Link href="/" className="hover:text-white transition-colors">HOME</Link>
          <ChevronRight className="w-3 h-3 text-neutral-600" />
          <Link href={`/${gender}/${categorySlug}`} className="hover:text-white transition-colors">{genderName}</Link>
          <ChevronRight className="w-3 h-3 text-neutral-600" />
          <span className="text-white font-bold">{categoryName}</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-900 pb-8 gap-6"
        >
          <div>
            <span className="font-mono text-[9px] md:text-[10px] text-neutral-500 tracking-[0.35em] block uppercase mb-2">
              {genderName}'S CAPSULE RELEASE
            </span>
            <h1 className="font-display font-medium text-3xl md:text-5xl text-white tracking-tight uppercase">
              {genderName} {categoryName}
            </h1>
          </div>
          <p className="text-xs text-neutral-500 font-sans font-light leading-relaxed max-w-sm">
            Curated premium streetwear crafted in Pakistan. Exquisite custom weights, high-contrast printing details, and relaxed cuts designed for ultimate confidence.
          </p>
        </motion.div>

        {/* Category Pills Navigation (Horizontal scrollable) */}
        <div className="mt-8 flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {CATEGORIES_LIST.map((cat) => {
            const isActive = cat.slug === categorySlug;
            const targetUrl = `/${gender}/${cat.slug}`;
            return (
              <Link
                key={cat.slug}
                href={targetUrl}
                className={`relative px-5 py-2.5 text-[11px] font-mono tracking-[0.2em] uppercase rounded-full border transition-all duration-300 whitespace-nowrap focus:outline-none ${
                  isActive
                    ? "bg-white text-black border-white font-bold"
                    : "bg-neutral-950 border-neutral-900 text-neutral-400 hover:text-white hover:border-neutral-800"
                }`}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Product Grid Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full flex-grow mb-32">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-24 bg-[#08080A] rounded-2xl border border-neutral-900">
            <div className="w-8 h-[1px] bg-neutral-800 mx-auto mb-4" />
            <p className="font-mono text-[10px] text-neutral-400 tracking-widest uppercase mb-1">
              NO PRODUCTS IN THIS CATEGORY
            </p>
            <p className="text-xs text-neutral-600 font-sans max-w-xs mx-auto">
              We are currently stitching and preparing a new capsule drop for this collection.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 bg-neutral-900 border border-neutral-800 text-white font-mono text-[10px] tracking-widest px-5 py-2.5 uppercase hover:bg-white hover:text-black hover:border-white rounded-md transition-all duration-300"
            >
              RETURN TO STORE
            </Link>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8"
          >
            {filteredProducts.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                {/* layout={false} disables conflicting framer layout animations on list changes */}
                <ProductCard product={product} layout={false} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Page Footer */}
      <Footer />
    </div>
  );
}
