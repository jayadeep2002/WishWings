import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WingSVG = ({ side }) => {
  // Define feather groups for a more realistic wing structure
  const featherGroups = [
    { count: 12, type: 'primary', length: 320, width: 22, spread: 50, startAngle: -15, startX: 40, startY: 0 },
    { count: 8, type: 'secondary', length: 220, width: 28, spread: 40, startAngle: 15, startX: 20, startY: 30 },
    { count: 6, type: 'tertiary', length: 140, width: 32, spread: 30, startAngle: 45, startX: 0, startY: 60 }
  ];

  return (
    <svg 
      viewBox="0 0 600 600" 
      className={`w-[350px] md:w-[500px] lg:w-[700px] filter drop-shadow-[0_0_40px_rgba(255,184,48,0.4)] ${side === 'right' ? 'scale-x-[-1]' : ''}`}
    >
      <defs>
        <linearGradient id="wingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFB830" />
          <stop offset="50%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#FFA500" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      <g transform="translate(150, 200)">
        {/* Core Wing Structure (Bone) */}
        <motion.path 
          d="M 0 0 C 100 -100 250 -80 300 0 C 280 50 200 120 150 150 C 100 180 0 200 -50 220" 
          fill="transparent"
          stroke="url(#wingGradient)"
          strokeWidth="15"
          strokeLinecap="round"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
        />

        {featherGroups.map((group, gIdx) => (
          <g key={group.type} transform={`translate(${group.startX}, ${group.startY})`}>
            {[...Array(group.count)].map((_, i) => {
              const angle = group.startAngle + (i * (group.spread / (group.count - 1)));
              const delay = 0.5 + (gIdx * 0.2) + (i * 0.05);
              
              const d = `M 0 0 C ${group.length * 0.3} ${group.width} ${group.length * 0.8} ${group.width * 0.6} ${group.length} 0 C ${group.length * 0.8} ${-group.width * 0.6} ${group.length * 0.3} ${-group.width} 0 0 Z`;

              return (
                <motion.path
                  key={`${group.type}-${i}`}
                  d={d}
                  fill="url(#wingGradient)"
                  initial={{ 
                    opacity: 0, 
                    rotate: side === 'left' ? -120 : 120,
                    scale: 0,
                    originX: 0,
                    originY: 0
                  }}
                  animate={{ 
                    opacity: 1, 
                    rotate: angle,
                    scale: 1
                  }}
                  transition={{ 
                    duration: 1.2, 
                    delay: delay,
                    ease: "easeOut"
                  }}
                  stroke="#FFFFFF"
                  strokeWidth="0.5"
                  strokeOpacity="0.4"
                  className="origin-left"
                />
              );
            })}
          </g>
        ))}
        
        {/* Highlight on the bone */}
        <motion.path 
          d="M 10 -10 C 100 -90 240 -70 280 -10" 
          fill="transparent"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />
      </g>
    </svg>
  );
};

const WingsIntro = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 1000);
    }, 4500); // 3.5s + some buffer for fade
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 z-[10000] bg-[#0A0E1A] flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Particle Background */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(50)].map((_, i) => (
              <div 
                key={i}
                className="absolute bg-wwGold/40 rounded-full"
                style={{
                  width: Math.random() * 4 + 'px',
                  height: Math.random() * 4 + 'px',
                  top: Math.random() * 100 + '%',
                  left: Math.random() * 100 + '%',
                  animation: `float ${Math.random() * 3 + 2}s infinite ease-in-out ${Math.random() * i}s`
                }}
              />
            ))}
          </div>

          <div className="relative flex items-center justify-center">
            {/* Left Wing */}
            <motion.div
              initial={{ x: -300, rotateY: -90, opacity: 0 }}
              animate={{ x: 0, rotateY: 0, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="origin-right"
            >
              <WingSVG side="left" />
            </motion.div>

            {/* Logo in Center */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="absolute z-20 flex flex-col items-center"
            >
              <img 
                src="/logo.png" 
                alt="Wish Wings" 
                className="w-[120px] h-[120px] object-contain animate-pulse-gold" 
              />
            </motion.div>

            {/* Right Wing */}
            <motion.div
              initial={{ x: 300, rotateY: 90, opacity: 0 }}
              animate={{ x: 0, rotateY: 0, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="origin-left"
            >
              <WingSVG side="right" />
            </motion.div>
          </div>

          {/* Intro Text */}
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 1 }}
            className="mt-8 text-3xl md:text-5xl font-playfair text-white tracking-widest text-center"
          >
            Fulfill Your Wishes Here
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            className="mt-4 font-dancing text-wwGold text-xl md:text-2xl"
          >
            Built with ❤️ to connect hearts
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WingsIntro;
