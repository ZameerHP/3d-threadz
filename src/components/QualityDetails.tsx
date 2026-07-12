import { Check, ShieldCheck, Sparkles, Layers } from "lucide-react";
import { motion } from "motion/react";
import fabricTexture from "../assets/images/fabric_texture_1783496076841.jpg";

export default function QualityDetails() {
  const specs = [
    {
      icon: <Layers className="w-5 h-5 text-neutral-400" />,
      title: "280-300 GSM COMPACT KNIT",
      desc: "Woven on special low-tension circular knitting machines using long-staple organic cotton. This creates an incredibly dense, smooth fabric with a structural, heavy drape that holds its form."
    },
    {
      icon: <Sparkles className="w-5 h-5 text-neutral-400" />,
      title: "METALLIC LIQUID CHROME INK",
      desc: "Our ink contains real microscopic aluminum flakes suspended in an elastic, water-based carrier. This allows the metallic mirror finish to expand with the shirt weave, preventing cracks or peeling."
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-neutral-400" />,
      title: "DOUBLE-NEEDLE MOCK NECK",
      desc: "Features a reinforced, tight 1.2-inch rib collar engineered with high-density spandex memory. The collar retains its shape and secure fit, avoiding the infamous 'bacon collar' wash after wash."
    }
  ];

  return (
    <section className="py-24 bg-neutral-950 border-b border-neutral-900 overflow-hidden relative">
      {/* Shared vignette blend top & bottom to remove hard cuts */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#0B0B0D] to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0B0B0D] to-transparent pointer-events-none z-10" />
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header Block */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-16 space-y-3"
        >
          <div className="inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-neutral-500" />
            <p className="font-mono text-[9px] md:text-[10px] text-neutral-400 tracking-[0.3em] uppercase">
              THE APPAREL ANATOMY
            </p>
          </div>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white tracking-tight uppercase leading-none">
            PRINT QUALITY & MATERIAL SPECIFICS
          </h2>
          <p className="font-sans font-light text-sm md:text-base text-neutral-400 leading-relaxed max-w-xl">
            Streetwear is defined by details you can feel. Our custom fabrication protocol sets a new standard for graphic garment endurance.
          </p>
        </motion.div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Close-Up Macro Image Showcase */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 relative group"
          >
            {/* Liquid chrome outline cage wrapper */}
            <div className="absolute -inset-1 bg-gradient-to-r from-neutral-800 via-neutral-900 to-neutral-700 rounded opacity-30 blur-sm pointer-events-none" />
            
            <div className="relative aspect-[16/9] w-full bg-neutral-900 rounded overflow-hidden border border-neutral-800 shadow-2xl">
              {/* Actual macro generated image */}
              <img
                src={fabricTexture}
                alt="Macro fabric texture and liquid metal chrome raised printing closeup"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-102"
                referrerPolicy="no-referrer"
              />

              {/* Focus labels on image */}
              <div className="absolute top-4 left-4 bg-[#0B0B0D]/90 backdrop-blur-md border border-neutral-800/80 px-3 py-1.5 rounded font-mono text-[9px] tracking-widest text-neutral-300 uppercase">
                FABRIC DETAIL // CLOSE-UP VIEW
              </div>

              {/* Pointer labels detailing printing quality */}
              <div className="absolute bottom-6 right-6 bg-[#0B0B0D]/90 backdrop-blur-md border border-neutral-800/80 p-3 rounded space-y-1 max-w-[200px]">
                <span className="font-mono text-[9px] text-neutral-500 font-bold block uppercase">
                  INK EMBOSS HEIGHT
                </span>
                <p className="text-xs text-white font-mono uppercase font-bold tracking-widest">
                  +0.45MM ELEVATION
                </p>
              </div>
            </div>
          </motion.div>

          {/* Core Specs Narrative */}
          <div className="lg:col-span-5 space-y-6">
            {specs.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="flex gap-4 p-5 bg-[#121215]/30 backdrop-blur-md rounded-xl border border-neutral-900/60 hover:border-neutral-800 hover:bg-neutral-900/40 transition-all duration-300"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                  {item.icon}
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-display font-bold text-xs md:text-sm text-white tracking-widest uppercase">
                    {item.title}
                  </h4>
                  <p className="font-sans text-xs text-neutral-400 leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
