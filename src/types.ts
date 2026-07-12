import teeFront from "./assets/images/tee_front_1783496022099.jpg";
import heroTee from "./assets/images/hero_tee_1783496003151.jpg";
import teeBack from "./assets/images/tee_back_1783496039290.jpg";
import teeMonogram from "./assets/images/tee_monogram_1783496055263.jpg";

export interface Product {
  id: string;
  name: string;
  category: "Oversized T-Shirts" | "Graphic Tees" | "Custom Printed T-Shirts" | "Polo Shirts" | "Streetwear Collection" | "Coming Soon Collection" | "Pants" | "Baggy Pants";
  gender: "men" | "women" | "unisex";
  subcategories: ("tshirts" | "baggy-tshirts" | "polo-shirts" | "pants" | "baggy-pants")[];
  price: number;
  originalPrice?: number;
  image: string;
  hoverImage?: string;
  badge?: 'NEW' | 'SALE' | 'LIMITED';
  sizes: string[];
  description: string;
  details: string[];
  fabric: string;
  weight: string;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  quantity: number;
}

export const PRODUCTS: Product[] = [
  {
    id: "3d-chrome-oversized-tee",
    name: "3D CHROME OVERSIZED TEE",
    category: "Oversized T-Shirts",
    gender: "unisex",
    subcategories: ["tshirts", "baggy-tshirts"],
    price: 2499,
    originalPrice: 2999,
    image: teeFront,
    hoverImage: heroTee,
    badge: "NEW",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Premium heavyweight streetwear oversized tee featuring a stunning high-density liquid-chrome screen print across the chest. Cut in our signature relaxed-boxy fit with dropped shoulders and a thick, sturdy 1.2-inch rib-knit mock collar. Crafted with attention to detail for people who want to wear confidence.",
    details: [
      "High-density 3D liquid metal chrome ink print",
      "Bespoke boxy streetwear fit with dropped shoulders",
      "Thick 1.2-inch rib-knit mock neck collar",
      "Double-needle stitched shoulders, sleeves, and hem",
      "Premium Combed Cotton for extreme comfort"
    ],
    fabric: "100% Premium Organic Combed Ring-Spun Cotton",
    weight: "280 GSM heavyweight knit jersey"
  },
  {
    id: "liquid-metal-archive-tee",
    name: "LIQUID METAL ARCHIVE TEE",
    category: "Graphic Tees",
    gender: "men",
    subcategories: ["tshirts"],
    price: 2799,
    originalPrice: 3499,
    image: teeBack,
    hoverImage: teeFront,
    badge: "SALE",
    sizes: ["M", "L", "XL", "XXL"],
    description: "Designed for high-impact confidence, the Archive Tee showcases a massive high-contrast 3D liquid metal graphic stretching across the back panel. Engineered to retain its structured drape, premium fit, and ultra-soft hand-feel after multiple washes.",
    details: [
      "Ultra-wide back panel liquid chrome layout",
      "Brushed steel monogram chest print accent",
      "Reactive-dyed graphite-black rich finish",
      "Pre-shrunk to minimize shrinkage",
      "100% Proudly Made in Pakistan"
    ],
    fabric: "100% Premium Pakistani Cotton, combed and carded",
    weight: "300 GSM ultra-heavyweight cotton"
  },
  {
    id: "stealth-monogram-classic-polo",
    name: "STEALTH MONOGRAM CLASSIC POLO",
    category: "Polo Shirts",
    gender: "men",
    subcategories: ["polo-shirts"],
    price: 3299,
    image: teeMonogram,
    hoverImage: heroTee,
    badge: "NEW",
    sizes: ["S", "M", "L", "XL"],
    description: "Elevate your streetwear rotation with our Classic Polo. Combining clean, structured lines with custom comfort, it features the 3D Threadz metallic monogram subtly printed on the chest. Tailored for those who appreciate premium daily essentials.",
    details: [
      "Subtle 3D silver-foil monogram chest emblem",
      "Premium double-knit pique cotton blend",
      "Structured flat-knit collar and two-button placket",
      "Reinforced neck tape and double-needle hem"
    ],
    fabric: "95% Combed Pakistani Cotton / 5% Elastane comfort blend",
    weight: "240 GSM breathable structured knit"
  },
  {
    id: "bespoke-custom-printed-tee",
    name: "BESPOKE CUSTOM PRINTED TEE",
    category: "Custom Printed T-Shirts",
    gender: "unisex",
    subcategories: ["tshirts"],
    price: 2999,
    originalPrice: 3999,
    image: heroTee,
    hoverImage: teeMonogram,
    badge: "LIMITED",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Bring your dream design to life. Our bespoke Custom Printed Tee allows you to submit your own custom graphics, logos, or typography and have them printed with premium 3D embossed metallic ink or luxury screenprints on our signature heavy blanks.",
    details: [
      "Fully custom print layout tailored to your artwork",
      "Premium 3D high-density puffed or metallic foil inks",
      "No minimum orders - curated personal pieces",
      "Consult directly with Zameer & Ali on design layout"
    ],
    fabric: "100% Premium Combed Ring-Spun Pakistani Cotton",
    weight: "280 GSM heavyweight structured jersey"
  },
  {
    id: "vintage-acid-wash-tee",
    name: "VINTAGE ACID-WASH STREETWEAR TEE",
    category: "Streetwear Collection",
    gender: "unisex",
    subcategories: ["tshirts"],
    price: 2899,
    originalPrice: 3499,
    image: teeMonogram,
    hoverImage: teeBack,
    badge: "NEW",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "An absolute essential. Hand-treated acid-wash delivers a rich, lived-in aesthetic, while bold 3D Threadz typography across the back commands immediate respect. Built for everyday confidence in the streets of Pakistan.",
    details: [
      "Custom hand-treated acid-wash finish (unique patterns)",
      "High-density 3D puff print branding elements",
      "Thick rib-knit mock collar for premium structure",
      "Soft silicone wash for unmatched comfort"
    ],
    fabric: "100% Pure Combed Cotton Jersey",
    weight: "260 GSM custom vintage weight cotton"
  },
  {
    id: "neo-cyber-future-tee",
    name: "REFLECTIVE MONOGRAM SHIELD TEE",
    category: "Coming Soon Collection",
    gender: "unisex",
    subcategories: ["tshirts"],
    price: 2999,
    image: heroTee,
    hoverImage: teeFront,
    badge: "LIMITED",
    sizes: ["M", "L", "XL"],
    description: "A digital exclusive sneak peek into our upcoming streetwear drop. Combining heavy structural fabrics with low-light holographic reflective printing that illuminates in low light. Locked capsule - limited reservations open.",
    details: [
      "Holographic multi-tonal reflective print technology",
      "Premium oversized boxy cuts designed by Ali & Zameer",
      "Reinforced cover-stitch seams for action durabilities",
      "Pre-register to guarantee delivery on drop day"
    ],
    fabric: "90% Organic Cotton / 10% Structured Technical Poly",
    weight: "290 GSM premium structured knit"
  },
  {
    id: "metropolis-pleated-pants",
    name: "METROPOLIS PLEATED WIDE PANTS",
    category: "Pants",
    gender: "men",
    subcategories: ["pants"],
    price: 3499,
    originalPrice: 4200,
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=600&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=600&auto=format&fit=crop",
    badge: "NEW",
    sizes: ["30", "32", "34", "36"],
    description: "Bespoke pleated smart-pants with a modern fluid drape. Engineered with front pintuck pleats, relaxed thighs, and a wide-leg straight cut that pools elegantly over chunky footwear. High-luxury finish for versatile day-to-night confidence.",
    details: [
      "Sharp front pintuck crease lines",
      "Concealed button closure with YKK premium metal zipper",
      "Deep side-seam pockets and rear welt pockets",
      "Unmatched fluid elegance and rich, heavy hand-feel"
    ],
    fabric: "70% Premium Poly / 26% Rayon / 4% Spandex high-density twill",
    weight: "340 GSM heavy suiting fabric"
  },
  {
    id: "utility-stealth-cargo-pants",
    name: "UTILITY STEALTH CARGO PANTS",
    category: "Pants",
    gender: "men",
    subcategories: ["pants"],
    price: 3899,
    image: "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?q=80&w=600&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1517423568366-8b83523034fd?q=80&w=600&auto=format&fit=crop",
    badge: "LIMITED",
    sizes: ["30", "32", "34", "36"],
    description: "Multi-pocket luxury tactical cargo pants designed with a relaxed straight-leg profile. Feature side geometric cargo utility pockets, knee articulation darts for maximum comfort, and adjustable cotton drawcords at the hem for convertible styling.",
    details: [
      "Premium low-profile side bellows cargo pockets",
      "Durable double-stitched reinforced seam construction",
      "Adjustable custom ankle cuffs with high-quality drawstrings",
      "Engineered knee articulation for free, unstructured movement"
    ],
    fabric: "100% Cotton heavy-duty ripstop weave",
    weight: "320 GSM rugged durable cotton"
  },
  {
    id: "stealth-drop-crotch-baggy",
    name: "STEALTH DROP-CROTCH BAGGY PANTS",
    category: "Baggy Pants",
    gender: "unisex",
    subcategories: ["baggy-pants"],
    price: 3699,
    originalPrice: 4500,
    image: "https://images.unsplash.com/photo-1551854838-212c50b4c184?q=80&w=600&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=600&auto=format&fit=crop",
    badge: "NEW",
    sizes: ["S", "M", "L", "XL"],
    description: "Ultra-relaxed baggy pants featuring an exaggerated dropped crotch design, wide-leg outline, and high-contrast dual side paneling. Designed specifically for an effortless casual silhouette with maximum urban impact.",
    details: [
      "Deep relaxed dropped crotch drop",
      "Elasticated broad waistband with elongated thick flat cords",
      "Invisible side-zipper pockets for secure item storage",
      "Signature boxy and baggy streetwear pooling fit"
    ],
    fabric: "80% Organic Cotton / 20% Polyester premium loopback blend",
    weight: "360 GSM ultra-heavyweight french terry"
  },
  {
    id: "heavy-loopback-baggy-sweats",
    name: "HEAVY LOOPBACK BAGGY SWEATPANTS",
    category: "Baggy Pants",
    gender: "unisex",
    subcategories: ["baggy-pants"],
    price: 3999,
    image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=600&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?q=80&w=600&auto=format&fit=crop",
    badge: "LIMITED",
    sizes: ["S", "M", "L", "XL"],
    description: "The ultimate cozy luxury sweatpants. Cut extremely baggy with a stacked ankle pooling. Finished with custom enzyme washing for an ultra-velvety touch, embroidered tonal logo monogram, and heavy metal aglets.",
    details: [
      "Custom enzyme-softened finish for superior hand-feel",
      "Wide comfortable elastic elastic ankle bands for stacking",
      "Premium heavy cotton drawstrings with matte-black aglets",
      "Subtle tonal embroidered monogram at left thigh"
    ],
    fabric: "100% Premium Pakistani Ring-Spun Cotton French Terry",
    weight: "420 GSM ultimate-weight loopback fabric"
  },
  {
    id: "womens-vogue-cream-tee",
    name: "WOMEN'S VINTAGE VOGUE TEE",
    category: "Oversized T-Shirts",
    gender: "women",
    subcategories: ["tshirts", "baggy-tshirts"],
    price: 1700,
    image: "/products/Generated Image July 11, 2026 - 10_46PM.jpg",
    hoverImage: "/products/Generated Image July 11, 2026 - 10_46PM (1).jpg",
    badge: "NEW",
    sizes: ["S", "M", "L", "XL"],
    description: "Channel retro-fashion vibes with this gorgeous Cream Vogue graphic tee! Featuring a super-relaxed boxy silhouette for maximum all-day comfort, this tee features an artistic magazine-cover print.",
    details: [
      "Chic Vogue magazine graphic cover design",
      "Heavyweight premium cream cotton blank",
      "Dropped shoulders and structured drape",
      "Double-stitched seams for durability"
    ],
    fabric: "100% Premium Organic Combed Cotton",
    weight: "260 GSM custom heavy jersey"
  },
  {
    id: "womens-nice-teddy-black-tee",
    name: "WOMEN'S NICE TEDDY BEAR TEE",
    category: "Oversized T-Shirts",
    gender: "women",
    subcategories: ["tshirts", "baggy-tshirts"],
    price: 1700,
    image: "/products/Generated Image July 11, 2026 - 10_46PM (5).jpg",
    hoverImage: "/products/Generated Image July 11, 2026 - 10_46PM (3).jpg",
    badge: "NEW",
    sizes: ["S", "M", "L", "XL"],
    description: "Meet your new favorite casual fit! This ultra-comfortable Black baggy tee features an adorable brown teddy bear nestled inside bold white letters with a sweet 'nice to meet you' message.",
    details: [
      "Adorable teddy bear 'NICE' layout print",
      "Soft-brushed premium black blank",
      "Oversized boyfriend fit with relaxed sleeves",
      "Durable reactive-dyed finish"
    ],
    fabric: "100% Ring-Spun Premium Cotton",
    weight: "250 GSM heavy jersey"
  },
  {
    id: "womens-runaway-bunny-black-tee",
    name: "WOMEN'S RUNAWAY RABBIT TEE",
    category: "Graphic Tees",
    gender: "women",
    subcategories: ["tshirts", "baggy-tshirts"],
    price: 1700,
    image: "/products/Generated Image July 11, 2026 - 10_47PM (1).jpg",
    hoverImage: "/products/Generated Image July 11, 2026 - 10_47PM.jpg",
    badge: "LIMITED",
    sizes: ["S", "M", "L", "XL"],
    description: "Add some edgy, artistic vibes to your wardrobe! Cut in a premium relaxed boyfriend drape for ultimate comfort, this Black t-shirt highlights a stunning floral-filled rabbit silhouette with raw typography.",
    details: [
      "Stunning floral-silhouette rabbit artwork",
      "Edgy gothic-style front print detail",
      "Extremely comfortable boxy street drape",
      "Pre-shrunk premium combed cotton blank"
    ],
    fabric: "100% Premium Combed Cotton",
    weight: "260 GSM heavy jersey"
  },
  {
    id: "womens-butterfly-mauve-tee",
    name: "WOMEN'S BUTTERFLY CLUSTER TEE",
    category: "Oversized T-Shirts",
    gender: "women",
    subcategories: ["tshirts", "baggy-tshirts"],
    price: 1700,
    image: "/products/Generated Image July 11, 2026 - 10_47PM (2).jpg",
    hoverImage: "/products/Generated Image July 11, 2026 - 10_47PM (3).jpg",
    badge: "NEW",
    sizes: ["S", "M", "L"],
    description: "Flutter in style with this lovely Mauve baggy tee! Adorned with beautiful pink and black butterflies on the chest and sleeves, its oversized boxy cut provides supreme comfort.",
    details: [
      "Beautiful multi-butterfly graphic layout",
      "Detailed butterfly placement prints on sleeves",
      "Rich mauve / dusty rose premium dyed fabric",
      "Broad neck ribbing for structured look"
    ],
    fabric: "95% Cotton / 5% Elastane comfort blend",
    weight: "240 GSM heavy jersey"
  },
  {
    id: "womens-positive-sakura-pink-tee",
    name: "WOMEN'S POSITIVE BLOSSOM TEE",
    category: "Graphic Tees",
    gender: "women",
    subcategories: ["tshirts", "baggy-tshirts"],
    price: 1700,
    image: "/products/Generated Image July 11, 2026 - 10_47PM (5).jpg",
    hoverImage: "/products/Generated Image July 11, 2026 - 10_47PM (6).jpg",
    badge: "NEW",
    sizes: ["S", "M", "L", "XL"],
    description: "Spread good vibes and cherry blossom dreams! This light Pink oversized tee features a blooming branch overlapping bold block lettering for a positive street look.",
    details: [
      "Vibrant cherry blossom branch illustration",
      "High-density 'POSITIVE' block lettering print",
      "Cloud-soft pastel pink pre-shrunk blank",
      "Double-stitched shoulders and hem lines"
    ],
    fabric: "100% Combed Pakistani Cotton",
    weight: "250 GSM heavy jersey"
  },
  {
    id: "womens-pragya-star-pink-tee",
    name: "WOMEN'S PRAGYA STAR 28 TEE",
    category: "Oversized T-Shirts",
    gender: "women",
    subcategories: ["tshirts", "baggy-tshirts"],
    price: 1700,
    image: "/products/Generated Image July 11, 2026 - 10_47PM (7).jpg",
    hoverImage: "/products/Generated Image July 11, 2026 - 10_47PM (8).jpg",
    badge: "NEW",
    sizes: ["S", "M", "L"],
    description: "Rock the ultimate varsity-grunge fusion! This cute Pink baggy tee combines collegiate block lettering with a lightning-star emblem and gothic script in an ultra-relaxed boxy fit.",
    details: [
      "Sporty collegiate '28' graphic print",
      "Detailed gothic text and star emblems",
      "Boxy and highly breathable cotton comfort",
      "Double-needle flatlock seams for durability"
    ],
    fabric: "100% Combed Cotton",
    weight: "250 GSM heavy jersey"
  },
  {
    id: "womens-rose-white-tee",
    name: "WOMEN'S SKETCHED ROSE TEE",
    category: "Graphic Tees",
    gender: "women",
    subcategories: ["tshirts", "baggy-tshirts"],
    price: 1700,
    image: "/products/Generated Image July 11, 2026 - 10_47PM (11).jpg",
    hoverImage: "/products/Generated Image July 11, 2026 - 10_47PM (12).jpg",
    badge: "LIMITED",
    sizes: ["S", "M", "L", "XL"],
    description: "Pure elegance meets modern streetwear. This crisp White baggy t-shirt boasts a striking red 'ROSE' text layout overlapping a beautiful black-and-white sketch, complete with dropped shoulders for all-day comfort.",
    details: [
      "Stunning fine-line sketched rose illustration",
      "High-contrast crimson typographic elements",
      "Thick premium white cotton jersey blank",
      "Clean double-stitch neck line finish"
    ],
    fabric: "100% Organic Combed Cotton",
    weight: "260 GSM heavy jersey"
  },
  {
    id: "womens-stealth-polo",
    name: "WOMEN'S STEALTH PIQUE POLO",
    category: "Polo Shirts",
    gender: "women",
    subcategories: ["polo-shirts"],
    price: 3199,
    image: "https://images.unsplash.com/photo-1563122810-8d53405785ef?q=80&w=600&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=600&auto=format&fit=crop",
    badge: "NEW",
    sizes: ["S", "M", "L"],
    description: "A premium women's polo combining classic athletic aesthetics with a modern raw edge streetwear twist. Features subtle tone-on-tone branding and a slightly cropped structured fit.",
    details: [
      "Slightly cropped structured silhouette",
      "Premium knit pique blend",
      "Flat-knit classic collar",
      "Tonal high-density monogram logo"
    ],
    fabric: "95% Combed Cotton / 5% Elastane pique blend",
    weight: "230 GSM breathable structured knit"
  },
  {
    id: "womens-pleated-trousers",
    name: "WOMEN'S CLASSIC PLEATED TROUSERS",
    category: "Pants",
    gender: "women",
    subcategories: ["pants"],
    price: 3599,
    originalPrice: 4200,
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=600&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=600&auto=format&fit=crop",
    badge: "NEW",
    sizes: ["26", "28", "30", "32"],
    description: "High-waisted tailored pleated trousers with a straight-leg drape. Fits perfectly at the waist and pools elegantly over sneakers for a clean, sophisticated streetwear look.",
    details: [
      "High-rise waist fit with double pleats",
      "YKK metal hook closure and zipper",
      "Deep functional slash pockets",
      "Wide-leg fluid silhouette"
    ],
    fabric: "75% Poly / 20% Rayon / 5% Spandex suiting fabric",
    weight: "310 GSM mid-weight suiting"
  }
];

export const STORIES = [
  {
    title: "FOUNDED AFTER CLASS 10 — BY TWO FRIENDS",
    subtitle: "OUR STORY",
    text: "3D Threadz was founded by two childhood friends, Zameer Panhwer and Ali Hassnain, right after completing Class 10. We shared a vision to revolutionize the streetwear scene in Pakistan. Starting with small initial sketches, our mission was simple: build a premium local streetwear brand that offers elite fabric quality, artistic custom printing, and modern fashion—made with absolute care and priced honestly.",
    image: heroTee
  },
  {
    title: "CRAFTED IN PAKISTAN WITH ATTENTION TO DETAIL",
    subtitle: "OUR ETHOS",
    text: "Proudly Pakistani, we reject cheap fabrics and thin prints. Every product in our capsule is created with deep attention to detail. We combine 100% premium Pakistani heavyweight cotton with specialized 3D liquid chrome ink that catches light. Each layout, custom print, and stitch is curated to make sure you wear confidence and feel premium every single day.",
    image: teeFront
  }
];
