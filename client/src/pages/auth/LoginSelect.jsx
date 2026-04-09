import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const TiltCard = ({ title, img, path, description, emoji }) => {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    setRotate({ x: rotateX, y: rotateY });
  };

  const resetRotate = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div className="tilt-card">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={resetRotate}
        onClick={() => navigate(path)}
        style={{
          rotateX: rotate.x,
          rotateY: rotate.y,
          transformStyle: "preserve-3d",
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="ww-glass cursor-pointer p-8 flex flex-col items-center justify-center text-center w-full max-w-sm mx-auto min-h-[300px] transition-transform duration-200"
      >
        <div 
          className="text-6xl mb-6 filter drop-shadow-[0_0_15px_rgba(255,184,48,0.4)]"
          style={{ transform: "translateZ(50px)" }}
        >
          {emoji}
        </div>
        <h2 
          className="text-2xl font-playfair font-bold text-white mb-3"
          style={{ transform: "translateZ(30px)" }}
        >
          {title}
        </h2>
        <p 
          className="text-wwTextSecondary text-sm font-dm"
          style={{ transform: "translateZ(20px)" }}
        >
          {description}
        </p>
        
        <div 
          className="mt-6 text-wwGold font-bold text-xs uppercase tracking-[0.2em]"
          style={{ transform: "translateZ(40px)" }}
        >
          Enter Portal →
        </div>
      </motion.div>
    </div>
  );
};

export default function LoginSelect() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-wwPrimary relative overflow-hidden">
      {/* Background Particles */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute bg-wwGold/30 rounded-full animate-float"
            style={{
              width: Math.random() * 10 + 2 + 'px',
              height: Math.random() * 10 + 2 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDelay: i * 0.5 + 's'
            }}
          />
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16 relative z-10"
      >
        <img 
          src="/logo.png" 
          alt="Wish Wings" 
          className="w-20 h-20 mx-auto mb-6 animate-pulse-gold" 
        />
        <h1 className="text-4xl md:text-5xl font-playfair text-white font-bold mb-4">
          Welcome to Wish Wings
        </h1>
        <p className="text-wwTextSecondary font-dm text-lg max-w-lg mx-auto">
          Choose your portal to begin the journey of connecting hearts across distances.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-6xl relative z-10">
        <TiltCard 
          title="I'm a User 🧡" 
          emoji="📦" 
          description="Book surprises, track deliveries, and relive memories in your vault."
          path="/user/login"
        />
        <TiltCard 
          title="I'm an Agent 🛡️" 
          emoji="🦅" 
          description="Join our team of heroes, fulfill wishes, and manage your assignments."
          path="/agent/login"
        />
        <TiltCard 
          title="Admin Panel 🔑" 
          emoji="⚖️" 
          description="Platform oversight, agent approvals, and system management."
          path="/admin/login"
        />
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-16 font-dancing text-wwGold text-xl"
      >
        "Fulfilling Wishes Across Every Mile"
      </motion.div>
    </div>
  );
}
