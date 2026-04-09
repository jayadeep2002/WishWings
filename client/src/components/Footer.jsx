import { Link } from 'react-router-dom';
import { FaTwitter, FaYoutube, FaInstagram, FaLinkedin, FaFacebook } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleComingSoon = (e) => {
    e.preventDefault();
    toast('Feature coming soon!', { icon: '🚀' });
  };

  return (
    <footer className="bg-wwPrimary pt-24 pb-12 border-t border-wwGold/5 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-wwGold/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center text-center">
          
          {/* Brand Identity */}
          <Link to="/" className="mb-10 relative group block">
            <div className="absolute -inset-10 bg-wwGold/15 blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity rounded-full pointer-events-none" />
            <div className="relative">
              <div className="bg-black/40 p-5 rounded-2xl border border-white/5 backdrop-blur-xl shadow-2xl transition-transform duration-500 group-hover:scale-110">
                <img src="/logo.png" alt="Wish Wings" className="h-20 w-auto animate-pulse-gold" />
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-1 bg-wwGold/20 blur-sm rounded-full" />
            </div>
          </Link>
          
          <h2 className="font-dancing text-4xl md:text-5xl text-wwGold mb-16 italic tracking-wider drop-shadow-lg">
            "Fulfilling Wishes Across Every Mile"
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-16 w-full mb-24 text-left">
             <div className="space-y-8">
                <h3 className="text-wwGold text-xs font-black uppercase tracking-[0.3em] opacity-80 border-b border-wwGold/10 pb-2 w-fit">The Brand</h3>
                <ul className="text-wwTextSecondary text-sm space-y-4 font-dm">
                  <li>
                    <Link to="/info/about" className="hover:text-wwGold transition-colors cursor-pointer group flex items-center gap-2">
                       <span className="w-1 h-1 bg-wwGold/0 group-hover:bg-wwGold transition-all rounded-full" />
                       About Wish Wings
                    </Link>
                  </li>
                  <li>
                    <Link to="/info/story" className="hover:text-wwGold transition-colors cursor-pointer group flex items-center gap-2">
                       <span className="w-1 h-1 bg-wwGold/0 group-hover:bg-wwGold transition-all rounded-full" />
                       Our Story
                    </Link>
                  </li>
                  <li>
                    <Link to="/info/impact" className="hover:text-wwGold transition-colors cursor-pointer group flex items-center gap-2">
                       <span className="w-1 h-1 bg-wwGold/0 group-hover:bg-wwGold transition-all rounded-full" />
                       Impact & Sustainability
                    </Link>
                  </li>
                  <li>
                    <Link to="/info/careers" className="hover:text-wwGold transition-colors cursor-pointer group flex items-center gap-2">
                       <span className="w-1 h-1 bg-wwGold/0 group-hover:bg-wwGold transition-all rounded-full" />
                       Careers
                    </Link>
                  </li>
                </ul>
             </div>
             
             <div className="space-y-8">
                <h3 className="text-wwGold text-xs font-black uppercase tracking-[0.3em] opacity-80 border-b border-wwGold/10 pb-2 w-fit">Service</h3>
                <ul className="text-wwTextSecondary text-sm space-y-4 font-dm">
                  <li className="hover:text-wwGold transition-colors cursor-pointer">
                    <Link to="/info/help">Help Center</Link>
                  </li>
                  <li className="hover:text-wwGold transition-colors cursor-pointer">
                    <Link to="/packages">Booking Guide</Link>
                  </li>
                  <li className="hover:text-wwGold transition-colors cursor-pointer">
                    <Link to="/agent/signup">Partner Network</Link>
                  </li>
                  <li className="hover:text-wwGold transition-colors cursor-pointer">
                    <Link to="/contact">Contact Support</Link>
                  </li>
                  <li className="hover:text-wwGold transition-colors cursor-pointer">
                    <Link to="/feedback">Give Feedback</Link>
                  </li>
                </ul>
             </div>

             <div className="space-y-8">
                <h3 className="text-wwGold text-xs font-black uppercase tracking-[0.3em] opacity-80 border-b border-wwGold/10 pb-2 w-fit">Legal</h3>
                <ul className="text-wwTextSecondary text-sm space-y-4 font-dm">
                  <li className="hover:text-wwGold transition-colors cursor-pointer">
                    <Link to="/info/terms">Terms of Service</Link>
                  </li>
                  <li className="hover:text-wwGold transition-colors cursor-pointer">
                    <Link to="/info/privacy">Privacy Policy</Link>
                  </li>
                  <li className="hover:text-wwGold transition-colors cursor-pointer">
                    <Link to="/info/cookies">Cookie Compliance</Link>
                  </li>
                  <li className="hover:text-wwGold transition-colors cursor-pointer">
                    <Link to="/info/safety">Safety Guidelines</Link>
                  </li>
                </ul>
             </div>

             <div className="space-y-8">
                <h3 className="text-wwGold text-xs font-black uppercase tracking-[0.3em] opacity-80 border-b border-wwGold/10 pb-2 w-fit">Socials</h3>
                <div className="flex gap-8 text-2xl">
                  <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-wwTextSecondary cursor-pointer hover:text-wwGold hover:-translate-y-2 transition-all">
                    <FaInstagram />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-wwTextSecondary cursor-pointer hover:text-wwGold hover:-translate-y-2 transition-all">
                    <FaTwitter />
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-wwTextSecondary cursor-pointer hover:text-wwGold hover:-translate-y-2 transition-all">
                    <FaLinkedin />
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-wwTextSecondary cursor-pointer hover:text-wwGold hover:-translate-y-2 transition-all">
                    <FaFacebook />
                  </a>
                </div>
                <div className="pt-4">
                  <p className="text-[10px] text-wwTextSecondary font-bold uppercase tracking-widest leading-relaxed opacity-60">
                    Trusted by 10k+ <br /> verified customers globally
                  </p>
                </div>
             </div>
          </div>

          {/* Footer Bottom */}
          <div className="w-full border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-10 text-wwTextSecondary text-[10px] uppercase tracking-[0.3em] font-bold">
            <p className="opacity-40">&copy; {currentYear} Wish Wings Internet Pvt Ltd</p>
            <div className="flex items-center gap-12">
               <span className="flex items-center gap-3 group cursor-default">
                 <span className="w-2 h-2 rounded-full bg-wwCoral animate-pulse" />
                 Made in India
               </span>
               <span className="text-wwGold/60 hover:text-wwGold transition-colors cursor-default">Registered Global Trade Entity</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
