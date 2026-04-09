import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { getImageUrl } from '../utils/getImageUrl';


export default function Navbar() {
  const { user, agent, admin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getDashboardLink = () => {
    if (admin) return '/admin/dashboard';
    if (agent) return '/agent/dashboard';
    if (user) return '/user/dashboard';
    return null;
  };

  const loggedIn = user || agent || admin;

  const navLinks = [
    ...(!admin ? [
      { name: 'Home', path: '/' },
      { name: 'Explore', path: '/packages' },
      { name: 'Contact', path: '/contact' },
    ] : [])
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
        isScrolled ? 'bg-wwPrimary/80 backdrop-blur-md py-3 border-b border-wwGold/10' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img src="/logo.png" alt="Wish Wings" className="h-10 w-auto animate-pulse-gold group-hover:scale-110 transition-transform" />
          <span className="text-2xl font-playfair font-bold text-white tracking-tight hidden sm:block">
            Wish<span className="text-wwGold">Wings</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              className={`font-dm text-sm uppercase tracking-[0.2em] transition-colors hover:text-wwGold ${
                location.pathname === link.path ? 'text-wwGold font-bold' : 'text-wwTextSecondary'
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          {loggedIn ? (
            <div className="relative group">
              <button className="flex items-center gap-3 text-wwGold font-bold text-sm uppercase tracking-widest border border-wwGold/30 px-4 py-2 rounded-sm hover:bg-wwGold hover:text-wwPrimary transition-all">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-wwGold/30 bg-wwGold/10 flex items-center justify-center text-[10px]">
                  {loggedIn.profilePhoto ? (
                    <img src={getImageUrl(loggedIn.profilePhoto)} alt="Profile" className="w-full h-full object-cover" />
                  ) : (

                    <span>{(user?.fullName || admin?.name || agent?.fullName || 'U')[0]}</span>
                  )}
                </div>
                <span className="hidden sm:inline">
                  {user ? user.fullName.split(' ')[0] : (admin ? 'Admin' : 'Agent')}
                </span>
                <span className="text-[10px]">▼</span>
              </button>
              <div className="absolute right-0 top-full pt-4 hidden group-hover:block">
                 <div className="ww-glass min-w-[200px] p-2 flex flex-col gap-1 border-wwGold/20">
                    <Link to={getDashboardLink()} className="px-4 py-3 text-sm text-white hover:bg-white/10 rounded-sm transition-colors uppercase tracking-widest">Dashboard</Link>
                    <button onClick={logout} className="w-full text-left px-4 py-3 text-sm text-wwCoral hover:bg-wwCoral/10 rounded-sm transition-colors uppercase tracking-widest font-bold">Sign Out</button>
                 </div>
              </div>
            </div>
          ) : (
            <Link to="/login">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="ww-button-gold !py-2 !px-6 !text-xs !tracking-[0.2em]"
              >
                LOGIN
              </motion.button>
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-wwGold"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-wwPrimary border-b border-wwGold/10 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-6">
               {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-dm text-lg text-white uppercase tracking-widest"
                >
                  {link.name}
                </Link>
              ))}
              {!loggedIn ? (
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="ww-button-gold text-center">LOGIN</Link>
              ) : (
                <button onClick={logout} className="text-wwCoral font-bold uppercase tracking-widest text-left">Sign Out</button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
