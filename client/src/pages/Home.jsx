import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { FaPlay, FaQuoteLeft, FaStar, FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import PackageCard from '../components/PackageCard';

// Error Boundary for internal sections
class SectionErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, info) { console.error("Section Error Caught:", error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="py-12 bg-red-900/20 text-red-500 text-center border border-red-500/50 m-4 rounded">
          <p className="font-bold">Something went wrong in this section: {this.props.name}</p>
          <p className="text-xs">{this.state.error?.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

console.log('[Home] CountUp Type:', typeof CountUp);
if (typeof CountUp === 'object') {
  console.log('[Home] CountUp Keys:', Object.keys(CountUp));
}

// ----------------------------------------------------------------------
// SUB-COMPONENTS (Outside main component to prevent re-definitions)
// ----------------------------------------------------------------------

const Hero = ({ y1, navigate }) => (
  <section className="relative h-screen flex items-center justify-center overflow-hidden bg-wwPrimary">
    <div className="absolute inset-0 z-0">
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: "110vh", opacity: 0 }}
          animate={{ 
            y: "-10vh", 
            opacity: [0, 1, 0],
            x: Math.random() * 100 + "vw" 
          }}
          transition={{ 
            duration: Math.random() * 10 + 10, 
            repeat: Infinity, 
            delay: Math.random() * 20 
          }}
          className="absolute text-wwGold/30 text-xl"
        >
          {i % 2 === 0 ? "❤️" : "✨"}
        </motion.div>
      ))}
    </div>

    <motion.div 
      style={{ y: y1 }}
      className="relative z-10 text-center px-6 max-w-4xl"
    >
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-dancing text-2xl text-wwGold mb-4">Bridging the distance...</motion.p>
      <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-8xl font-playfair font-bold text-white mb-8 leading-tight">
        Make Every Mile <br/> <span className="text-wwGold animate-pulse-gold italic">Feel Like Home</span>
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-wwTextSecondary text-lg md:text-xl font-dm mb-12 max-w-2xl mx-auto">
        Book a local surprise agent anywhere in India to deliver happiness, memories, and heartfelt wishes.
      </motion.p>
      <div className="flex flex-col sm:flex-row gap-6 justify-center">
        <button onClick={() => navigate('/packages')} className="ww-button-gold !px-12 !py-4 text-sm tracking-widest uppercase">Book a Surprise</button>
        <button className="px-12 py-4 border border-white/20 text-white rounded-sm font-bold uppercase tracking-widest text-sm hover:bg-white/5 transition-all">How It Works</button>
      </div>
    </motion.div>
    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-wwPrimary to-transparent pointer-events-none" />
  </section>
);

const HowItWorks = () => {
  const steps = [
    { id: 1, title: 'Browse Package', icon: '🎁', desc: 'Choose from 50+ curated surprise themes.' },
    { id: 2, title: 'Recipient Details', icon: '📝', desc: 'Tell us where and when to deliver the joy.' },
    { id: 3, title: 'Agent Assigned', icon: '🛡️', desc: 'A verified local hero starts the mission.' },
    { id: 4, title: 'Watch Live', icon: '📹', desc: 'See the reaction live in your Director Mode.' }
  ];
  return (
    <section className="py-24 bg-wwPrimary relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-playfair font-bold text-white mb-20 relative inline-block">
          The Magic Behind the Scene
          <div className="absolute -bottom-4 left-0 w-full h-1 bg-wwGold/30 rounded-full" />
        </h2>
        <div className="relative flex flex-col md:flex-row justify-between gap-12 md:gap-4 lg:gap-8">
          <svg className="absolute top-1/2 left-0 w-full h-2 hidden md:block -z-0 opacity-20" preserveAspectRatio="none">
             <motion.path d="M 0 5 H 1200" stroke="#FFB830" strokeWidth="4" strokeDasharray="10 15" animate={{ strokeDashoffset: -100 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} />
          </svg>
          {steps.map((step, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.2 }} className="flex-1 ww-glass p-8 relative z-10 group hover:-translate-y-2 transition-transform border-wwGold/10">
              <div className="w-16 h-16 bg-wwGold/10 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 group-hover:bg-wwGold group-hover:scale-110 transition-all shadow-[0_0_20px_rgba(255,184,48,0.1)]">{step.icon}</div>
              <h3 className="text-white font-playfair font-bold text-xl mb-3">{step.title}</h3>
              <p className="text-wwTextSecondary text-sm font-dm">{step.desc}</p>
              <div className="absolute top-4 right-4 text-wwGold/20 font-bold text-4xl">0{step.id}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PackagesPreview = ({ packages, navigate }) => (
  <section className="py-24 bg-wwSecondary relative overflow-hidden">
     <div className="max-w-7xl mx-auto px-6 mb-12 flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-playfair font-bold text-white mb-2">Popular Surprises</h2>
          <p className="text-wwGold font-dancing text-xl">Top picks from our community</p>
        </div>
        <button onClick={() => navigate('/packages')} className="text-wwGold font-dm text-sm uppercase tracking-widest font-bold flex items-center gap-2 hover:gap-4 transition-all">
          See All Packages <FaChevronRight />
        </button>
     </div>
     <div className="flex gap-8 overflow-x-auto px-6 pb-12 snap-x hide-scrollbar scroll-smooth">
        {packages.map((pkg, i) => (
          <motion.div key={pkg._id} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} className="snap-center shrink-0 w-[300px] md:w-[350px]">
            <PackageCard pkg={pkg} />
          </motion.div>
        ))}
     </div>
  </section>
);

const WhyWishWings = () => {
  const { ref, inView } = useInView({ threshold: 0.3 });

  // Safety check for CountUp (handling potential ESM/CJS interop issues)
  const CountUpComponent = typeof CountUp === 'function' ? CountUp : (CountUp?.CountUp || CountUp?.default || null);

  const stats = [
    { label: 'Surprises Delivered', value: 500, suffix: '+' },
    { label: 'Verified Heroes', value: 100, suffix: '+' },
    { label: 'Cities Covered', value: 15, suffix: '+' },
  ];
  return (
    <section ref={ref} className="py-24 bg-wwPrimary">
       <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
             <h2 className="text-5xl font-playfair font-bold text-white leading-tight">Why Trust Us with Your <span className="text-wwGold italic">Wishes?</span></h2>
             <p className="text-wwTextSecondary font-dm text-lg leading-relaxed">We don't just deliver products; we deliver emotions. Every agent is hand-picked and trained to handle your special moments with the care they deserve.</p>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
                {stats.map((stat, i) => (
                  <div key={i} className="text-center md:text-left">
                     <h3 className="text-4xl font-bold text-wwGold mb-2">
                       {inView && CountUpComponent ? (
                         <CountUpComponent end={stat.value} duration={3} />
                       ) : (
                         <span>{stat.value}</span>
                       )}{stat.suffix}
                     </h3>
                     <p className="text-xs uppercase tracking-widest text-white/60 font-bold">{stat.label}</p>
                  </div>
                ))}
             </div>
          </div>
          <div className="grid grid-cols-2 gap-6 relative">
             <motion.div initial={{ y: 20 }} whileInView={{ y: 0 }} className="ww-glass p-8 flex flex-col items-center justify-center text-center">
                <span className="text-4xl mb-4">📍</span>
                <h4 className="text-white font-bold text-lg mb-2">Live Tracking</h4>
                <p className="text-wwTextSecondary text-xs">Watch your surprise unfold in real-time.</p>
             </motion.div>
             <motion.div initial={{ y: -20 }} whileInView={{ y: 0 }} className="ww-glass p-8 flex flex-col items-center justify-center text-center mt-12 bg-wwGold/5 border-wwGold/30">
                <span className="text-4xl mb-4">🛡️</span>
                <h4 className="text-white font-bold text-lg mb-2">Verified Agents</h4>
                <p className="text-wwTextSecondary text-xs">Safety and quality are our top priorities.</p>
             </motion.div>
          </div>
       </div>
    </section>
  );
};

const ReactionVaultPreview = () => (
  <section className="py-24 bg-wwSecondary">
     <div className="max-w-7xl mx-auto px-6 text-center mb-16">
        <h2 className="text-4xl font-playfair font-bold text-white mb-4">The Reaction Vault</h2>
        <p className="text-wwTextSecondary max-w-lg mx-auto">Memories that last forever. Here's a glimpse into the joy we've shared.</p>
     </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-7xl mx-auto px-6">
        {[1,2,3,4,5,6].map(i => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="relative overflow-hidden group rounded-xl aspect-square">
            <img src={`/reactions/react${i}.jpg`} alt={`Reaction ${i}`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
               <div className="text-left">
                  <p className="text-wwGold font-bold text-xs uppercase tracking-widest mb-1">Impact {i*10 + 40}%</p>
                  <p className="text-white font-playfair text-lg">Emotional Resonance</p>
               </div>
            </div>
          </motion.div>
        ))}
      </div>
  </section>
);

const Testimonials = () => {
  const reviews = [
    { name: "Sarah J.", city: "New York, USA", flag: "🇺🇸", text: "Wish Wings made my mom's 60th birthday unforgettable! I'm thousands of miles away, but I felt like I was there. The agent was amazing." },
    { name: "Rahul M.", city: "London, UK", flag: "🇬🇧", text: "The live tracking is a game changer. Watching my sister's face when the surprise box opened was priceless. Highly recommended!" },
    { name: "Amit K.", city: "Dubai, UAE", flag: "🇦🇪", text: "Professional service, verified agents, and pure happiness. Bridge the distance, literally! Thank you team Wish Wings." }
  ];
  return (
    <section className="py-24 bg-wwPrimary relative">
       <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
             <FaQuoteLeft className="text-5xl text-wwGold/20 mx-auto mb-6" />
             <h2 className="text-4xl font-playfair font-bold text-white italic">"Connecting Hearts Across Borders"</h2>
          </div>
          <div className="flex overflow-hidden relative">
             <motion.div animate={{ x: ["0%", "-100%"] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="flex gap-8 whitespace-normal w-full">
               {[...reviews, ...reviews].map((rev, i) => (
                  <div key={i} className="min-w-full md:min-w-[450px] ww-glass p-8 flex flex-col justify-between border-white/5">
                     <p className="text-wwTextSecondary font-dm italic mb-8 leading-relaxed">"{rev.text}"</p>
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-wwGold/10 rounded-full flex items-center justify-center text-xl shadow-inner">{rev.flag}</div>
                        <div>
                           <h4 className="text-white font-bold text-sm tracking-wide">{rev.name}</h4>
                           <p className="text-wwGold font-dm text-[11px] uppercase tracking-widest">{rev.city}</p>
                        </div>
                     </div>
                  </div>
               ))}
             </motion.div>
          </div>
       </div>
    </section>
  );
};

const CityCoverage = () => (
  <section className="py-24 bg-wwSecondary">
     <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
           <h2 className="text-5xl font-playfair font-bold text-white mb-6 leading-tight">We're Growing <br/> <span className="text-wwGold">Faster than Ever</span></h2>
           <p className="text-wwTextSecondary font-dm text-lg leading-relaxed mb-8">Currently serving over 15 major cities in India. Our mission is to cover every corner by 2027.</p>
           <div className="flex flex-wrap gap-3">
              {['Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad'].map(city => (
                <span key={city} className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-full text-xs font-bold tracking-widest uppercase hover:text-wwGold hover:border-wwGold transition-all cursor-crosshair">{city}</span>
              ))}
              <span className="px-4 py-2 bg-wwGold text-wwPrimary rounded-full text-xs font-bold tracking-widest uppercase animate-pulse">More Soon</span>
           </div>
        </div>
        <div className="relative flex justify-center py-12">
           <div className="w-[350px] h-[450px] relative">
             <svg viewBox="0 0 200 240" className="w-full h-full fill-wwPrimary stroke-wwGold/30">
               <path d="M100 0 L110 20 L130 30 L150 20 L160 40 L180 50 L190 70 L200 90 L180 120 L160 150 L140 180 L120 200 L110 230 L100 240 L90 230 L80 200 L60 180 L40 150 L20 120 L0 90 L10 70 L20 50 L40 40 L50 20 L70 30 L90 20 Z" />
               {[{x:100, y:50}, {x:40, y:120}, {x:90, y:200}, {x:120, y:140}, {x:140, y:190}, {x:160, y:100}].map((p, i) => (
                 <g key={i}>
                   <circle cx={p.x} cy={p.y} r="3" fill="#FFB830" className="animate-ping" style={{ transformOrigin: `${p.x}px ${p.y}px` }} />
                   <circle cx={p.x} cy={p.y} r="2" fill="#FFB830" />
                 </g>
               ))}
             </svg>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-wwPrimary/80 p-6 ww-glass border-wwGold/20 text-center">
                <h5 className="text-3xl font-bold text-white mb-1">15+</h5>
                <p className="text-[10px] uppercase font-bold text-wwGold tracking-[.2em]">Live Hubs</p>
             </div>
           </div>
        </div>
     </div>
  </section>
);

const EmotionalCTA = ({ navigate }) => (
  <section className="py-32 bg-wwPrimary relative overflow-hidden">
     <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <img src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1200&q=80" alt="Emotional" className="w-full h-full object-cover" />
     </div>
     <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.h2 initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} className="text-4xl md:text-6xl font-playfair font-bold text-white mb-8 leading-tight">
          "Your mom's birthday is tomorrow. <br/> <span className="text-wwGold italic">We've got you.</span>"
        </motion.h2>
        <p className="text-wwTextSecondary font- dm text-lg md:text-xl mb-12">Distance shouldn't stop a smile. Choose a package today and let us do the rest.</p>
        <motion.button whileHover={{ scale: 1.1, boxShadow: "0 0 30px rgba(255,184,48,0.4)" }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/packages')} className="ww-button-gold !px-16 !py-6 text-lg uppercase tracking-widest font-bold">BOOK NOW</motion.button>
     </div>
  </section>
);

// ----------------------------------------------------------------------
// MAIN HOME COMPONENT
// ----------------------------------------------------------------------

export default function Home() {
  const [packages, setPackages] = useState([]);
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await axios.get(`http://${window.location.hostname}:5000/api/packages`);
        setPackages(res.data.packages.slice(0, 6)); 
      } catch (err) {
        console.error("Failed to load packages");
      }
    };
    fetchPackages();
  }, []);

  return (
    <div className="bg-wwPrimary font-dm">
      <SectionErrorBoundary name="Hero"><Hero y1={y1} navigate={navigate} /></SectionErrorBoundary>
      <SectionErrorBoundary name="HowItWorks"><HowItWorks /></SectionErrorBoundary>
      <SectionErrorBoundary name="PackagesPreview"><PackagesPreview packages={packages} navigate={navigate} /></SectionErrorBoundary>
      <SectionErrorBoundary name="WhyWishWings"><WhyWishWings /></SectionErrorBoundary>
      <SectionErrorBoundary name="ReactionVaultPreview"><ReactionVaultPreview /></SectionErrorBoundary>
      <SectionErrorBoundary name="Testimonials"><Testimonials /></SectionErrorBoundary>
      <SectionErrorBoundary name="CityCoverage"><CityCoverage /></SectionErrorBoundary>
      <SectionErrorBoundary name="EmotionalCTA"><EmotionalCTA navigate={navigate} /></SectionErrorBoundary>
    </div>
  );
}
