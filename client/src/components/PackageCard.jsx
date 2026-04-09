import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHeart, FaStar, FaGift } from 'react-icons/fa';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const occasionEmojis = {
  'Birthday': '🎂', 'Anniversary': '💍', 'Welcome Home': '🏠', 'Baby Shower': '👶',
  'Graduation': '🎓', 'Engagement': '💑', 'Wedding': '💒', 'Housewarming': '🏡',
  'Retirement': '🎉', "Valentine's Day": '❤️', "Mother's Day": '👩', "Father's Day": '👨',
  'Farewell': '👋', 'Promotion': '🏆', 'Other': '✨'
};

export default function PackageCard({ pkg, isWishlisted = false, onWishlistChange, selectedOccasion = '' }) {
  const navigate = useNavigate();
  const [wishlisted, setWishlisted] = useState(isWishlisted);
  const [wishLoading, setWishLoading] = useState(false);
  
  // Dummy rating generator based on ID for visual consistency
  const rating = (4 + (pkg._id.charCodeAt(0) % 10) / 10).toFixed(1);
  
  // Create a placeholder image if none exists
  const imageUrl = pkg.image || pkg.coverImage || "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=500&q=80";

  const handleBookForOccasion = (e) => {
    e.stopPropagation();
    navigate(`/package/${pkg._id}?occasion=${encodeURIComponent(selectedOccasion)}&autoScroll=true`);
  };

  const toggleWishlist = async (e) => {
    e.stopPropagation();
    const token = sessionStorage.getItem('wishwings_user_token');
    if (!token) {
      toast.error('Please log in to save wishlist items', { icon: '🔒' });
      return;
    }
    setWishLoading(true);
    try {
      if (wishlisted) {
        await axios.delete(`http://localhost:5000/api/wishlist/${pkg._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWishlisted(false);
        toast.success('Removed from wishlist', { icon: '💔' });
      } else {
        await axios.post('http://localhost:5000/api/wishlist', { packageId: pkg._id }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWishlisted(true);
        toast.success('Added to wishlist!', { icon: '💛' });
      }
      onWishlistChange?.();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Wishlist update failed');
    } finally {
      setWishLoading(false);
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      onClick={() => navigate(`/package/${pkg._id}${selectedOccasion ? `?occasion=${encodeURIComponent(selectedOccasion)}` : ''}`)}
      className={`ww-glass group relative overflow-hidden flex flex-col h-full cursor-pointer transition-all duration-500 ${
        selectedOccasion ? 'border-wwGold/30 ring-1 ring-wwGold/10' : 'border-white/5 hover:border-wwGold/30'
      }`}
    >
      {/* Product Image Area */}
      <div className="relative h-56 w-full overflow-hidden">
        <img 
          src={imageUrl} 
          alt={pkg.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        {/* Glow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-wwPrimary/80 to-transparent opacity-60" />
        
        {/* Wishlist Heart Icon */}
        <button 
          onClick={toggleWishlist}
          disabled={wishLoading}
          className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all z-10 ${
            wishlisted 
              ? 'bg-wwCoral/20 backdrop-blur-sm border border-wwCoral/30 text-wwCoral' 
              : 'text-white/50 hover:text-wwCoral bg-black/20 backdrop-blur-sm border border-white/10'
          } ${wishLoading ? 'opacity-50' : ''}`}
        >
          <FaHeart className={`text-sm ${wishlisted ? 'scale-110' : ''} transition-transform`} />
        </button>

        {/* Category Badge */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
           <span className="bg-wwGold text-wwPrimary text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full shadow-[0_0_10px_rgba(255,184,48,0.3)]">
             {pkg.category}
           </span>
        </div>

        {/* Occasion Badge on Image */}
        {selectedOccasion && (
          <div className="absolute top-4 left-4 bg-wwPrimary/80 backdrop-blur-sm border border-wwGold/40 rounded-full px-3 py-1 flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,184,48,0.2)]">
            <span className="text-sm">{occasionEmojis[selectedOccasion] || '✨'}</span>
            <span className="text-[9px] font-bold text-wwGold uppercase tracking-wider">{selectedOccasion}</span>
          </div>
        )}
      </div>
      
      {/* Product Details */}
      <div className="p-6 flex flex-col flex-grow bg-wwCard/30">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-playfair font-bold text-white group-hover:text-wwGold transition-colors truncate pr-2">{pkg.name}</h3>
          <div className="flex items-center gap-1.5 text-wwGold shrink-0">
             <span className="text-sm font-bold">{rating}</span>
             <FaStar className="text-xs" />
          </div>
        </div>

        <p className="text-wwTextSecondary text-xs font-dm mb-6 line-clamp-2 leading-relaxed">
          {pkg.description || "A magical surprise experience curated specially for your loved ones back home."}
        </p>

        <div className="mt-auto">
          {selectedOccasion ? (
            /* Show Book for Occasion CTA */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] text-wwTextSecondary uppercase tracking-widest font-bold">Starts from</span>
                  <span className="text-xl font-bold text-white">₹{pkg.price}</span>
                </div>
              </div>
              <button
                onClick={handleBookForOccasion}
                className="w-full py-3 bg-gradient-to-r from-wwGold to-amber-500 text-wwPrimary font-bold text-xs uppercase tracking-[0.15em] rounded-sm flex items-center justify-center gap-2 hover:shadow-[0_0_25px_rgba(255,184,48,0.4)] transition-all duration-300 group/btn"
              >
                <FaGift className="text-sm group-hover/btn:animate-bounce" />
                Book for {selectedOccasion}
              </button>
            </div>
          ) : (
            /* Default View */
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] text-wwTextSecondary uppercase tracking-widest font-bold">Starts from</span>
                <span className="text-xl font-bold text-white">₹{pkg.price}</span>
              </div>
              
              <motion.div 
                whileHover={{ x: 5 }}
                className="w-10 h-10 rounded-full border border-wwGold/20 flex items-center justify-center text-wwGold group-hover:bg-wwGold group-hover:text-wwPrimary transition-all duration-300"
              >
                →
              </motion.div>
            </div>
          )}
        </div>
      </div>

      {/* Hover Shimmer */}
      <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-25deg] group-hover:translate-x-[200%] transition-transform duration-1000 pointer-events-none" />
    </motion.div>
  );
}
