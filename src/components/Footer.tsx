import { useState, FormEvent } from "react";
import { Instagram, Twitter, Youtube, ArrowRight, CheckCircle, ShieldCheck } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail("");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-[#0B0B0D] border-t border-neutral-900/60 pt-20 pb-12 relative z-10 font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Main Clean Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 items-start">
          
          {/* Brand Presentation Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-3 group focus-visible:outline-neutral-400 rounded-md"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-800 via-neutral-200 to-neutral-700 p-[1px] flex items-center justify-center overflow-hidden transition-transform duration-500 group-hover:rotate-12">
                <div className="w-full h-full bg-[#0D0D11] rounded-full overflow-hidden flex items-center justify-center">
                  <img 
                    src="/logo.jpeg" 
                    alt="3D THREADZ Brand Logo"
                    className="w-full h-full object-cover scale-[1.05]"
                  />
                </div>
              </div>
              <span className="font-hero-funky font-black text-sm tracking-[0.3em] text-white">
                3D THREADZ
              </span>
            </button>
            
            <p className="text-xs text-neutral-400 font-light leading-relaxed max-w-sm">
              Meticulous limited-batch streetwear capsules. Designed with passion in Pakistan, constructed with luxury materials for the next generation.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-3.5 pt-2">
              {[
                { icon: <Instagram className="w-4 h-4" />, url: "https://instagram.com", label: "Visit Instagram profile" },
                { icon: <Twitter className="w-4 h-4" />, url: "https://twitter.com", label: "Visit Twitter profile" },
                { icon: <Youtube className="w-4 h-4" />, url: "https://youtube.com", label: "Visit Youtube channel" }
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-8 h-8 rounded-full bg-neutral-900/60 border border-neutral-900 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-700 transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Modern Navigation (3 cols) */}
          <div className="lg:col-span-3 space-y-4 lg:pl-8">
            <h5 className="font-mono text-[9px] font-bold tracking-[0.25em] text-neutral-500 uppercase">DIRECTORIES</h5>
            <div className="flex flex-col space-y-2.5 font-mono text-[10px] tracking-widest text-neutral-400">
              <a href="#shop-the-drop" className="hover:text-white transition-colors">SHOP THE DROP</a>
              <a href="#our-story" className="hover:text-white transition-colors">OUR ETHOS</a>
              <a href="mailto:3d.threadz14@gmail.com" className="hover:text-white transition-colors">SUPPORT & ENQUIRIES</a>
              <a href="https://wa.me/923353162656" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WHATSAPP CONCIERGE</a>
            </div>
          </div>

          {/* Minimalist Contact/Office Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="font-mono text-[9px] text-neutral-500 font-bold tracking-[0.25em] block uppercase">
                NEWSLETTER ENROLLMENT
              </span>
              <h4 className="font-display font-medium text-base text-white tracking-wide uppercase">
                UNLOCK PRIORITY ACCESS
              </h4>
            </div>

            {isSubscribed ? (
              <div className="flex items-center gap-3 bg-neutral-950/60 border border-neutral-900 p-4 rounded-lg max-w-sm">
                <CheckCircle className="w-4 h-4 text-neutral-300 flex-shrink-0" />
                <span className="font-mono text-[9px] text-neutral-400 tracking-wider uppercase">
                  REGISTRATION SUCCESSFUL. CHROME ALERTS ON.
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="max-w-md space-y-2">
                <div className="flex gap-2">
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ENTER EMAIL ADDRESS"
                    className="flex-grow bg-neutral-950/60 border border-neutral-900 focus:border-neutral-700 text-white font-mono text-[10px] tracking-widest p-3 outline-none rounded transition-colors uppercase placeholder:text-neutral-600"
                  />
                  <button
                    type="submit"
                    className="bg-white hover:bg-neutral-200 text-[#0B0B0D] font-mono font-bold text-[9px] tracking-widest px-5 rounded uppercase transition-colors flex items-center gap-1.5"
                  >
                    <span>JOIN</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[8px] text-neutral-600 uppercase">
                  <ShieldCheck className="w-3 h-3" />
                  <span>SECURE RELEASE ENROLLMENT DECRYPTION</span>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Divider line */}
        <div className="w-full h-[1px] bg-neutral-900/60 mb-8" />

        {/* Bottom Clean Footer Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 font-mono text-[9px] text-neutral-500 uppercase tracking-[0.15em]">
          <div className="space-y-1">
            <p>© {currentYear} 3D THREADZ. ALL RIGHTS RESERVED.</p>
            <p className="text-neutral-600 text-[8px]">
              FOUNDED BY ZAMEER PANHWER & ALI HASSNAIN // MIRPUR KHAS, SINDH, PAKISTAN
            </p>
          </div>

          {/* Secure Payment System Badges */}
          <div className="flex flex-wrap gap-2 text-neutral-500 text-[8px]">
            {["COD", "EASYPAISA", "JAZZCASH", "BANK TRANSFER"].map((pay) => (
              <span key={pay} className="px-2 py-0.5 border border-neutral-900 rounded bg-neutral-950/40">
                {pay}
              </span>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
