import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaStar, FaArrowRight, FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function Wishlist() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = sessionStorage.getItem('wishwings_user_token');
        const res = await axios.get(`http://${window.location.hostname}:5000/api/wishlist`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWishlist(res.data.wishlist);
      } catch (err) {
        toast.error('Failed to load wishlist');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchWishlist();
  }, [user]);

  const removeItem = async (packageId) => {
    try {
      const token = sessionStorage.getItem('wishwings_user_token');
      await axios.delete(`http://${window.location.hostname}:5000/api/wishlist/${packageId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWishlist(prev => prev.filter(item => item.package?._id !== packageId));
      toast.success('Removed from wishlist', { icon: '💔' });
    } catch (err) {
      toast.error('Failed to remove');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-wwPrimary flex flex-col justify-center items-center gap-4">
      <div className="w-12 h-12 border-4 border-wwGold border-t-transparent rounded-full animate-spin"></div>
      <p className="text-wwGold font-bold uppercase tracking-widest text-xs">Loading Wishlist...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-wwPrimary pt-28 pb-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10"
        >
          <div>
            <h1 className="text-4xl font-playfair font-bold text-white">My Wishlist</h1>
            <p className="text-wwTextSecondary text-sm font-dm mt-1">
              {wishlist.length} {wishlist.length === 1 ? 'wish' : 'wishes'} saved
            </p>
          </div>
          <button
            onClick={() => navigate('/packages')}
            className="ww-button-gold !px-6 !py-2 text-[10px] tracking-widest border-none flex items-center gap-2"
          >
            Explore More <FaArrowRight className="text-[8px]" />
          </button>
        </motion.div>

        {/* Empty State */}
        {wishlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="ww-glass p-20 text-center border-white/5"
          >
            <div className="text-7xl mb-6 opacity-30">💛</div>
            <h3 className="text-2xl font-playfair font-bold text-white mb-2">Your Wishlist is Empty</h3>
            <p className="text-wwTextSecondary font-dm text-sm mb-8 max-w-md mx-auto">
              Tap the heart icon on any package to save it here. Your wishes are waiting to be discovered.
            </p>
            <button
              onClick={() => navigate('/packages')}
              className="text-wwGold font-bold uppercase tracking-widest text-xs hover:underline"
            >
              Browse Packages →
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {wishlist.map((item, index) => {
                const pkg = item.package;
                if (!pkg) return null;
                const imageUrl = pkg.coverImage || "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=500&q=80";

                return (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className="ww-glass group relative overflow-hidden flex flex-col border-white/5 hover:border-wwGold/30 transition-all duration-500"
                  >
                    {/* Image */}
                    <div className="relative h-52 w-full overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={pkg.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-wwPrimary/80 to-transparent opacity-60" />

                      {/* Remove Button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); removeItem(pkg._id); }}
                        className="absolute top-4 right-4 w-9 h-9 bg-wwCoral/20 backdrop-blur-sm border border-wwCoral/30 rounded-full flex items-center justify-center text-wwCoral hover:bg-wwCoral hover:text-white transition-all z-10"
                      >
                        <FaHeart className="text-sm" />
                      </button>

                      {/* Category */}
                      <div className="absolute bottom-4 left-4">
                        <span className="bg-wwGold text-wwPrimary text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full shadow-[0_0_10px_rgba(255,184,48,0.3)]">
                          {pkg.category}
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div
                      className="p-6 flex flex-col flex-grow bg-wwCard/30 cursor-pointer"
                      onClick={() => navigate(`/package/${pkg._id}`)}
                    >
                      <h3 className="text-lg font-playfair font-bold text-white group-hover:text-wwGold transition-colors mb-2 truncate">
                        {pkg.name}
                      </h3>
                      <p className="text-wwTextSecondary text-xs font-dm mb-4 line-clamp-2 leading-relaxed">
                        {pkg.description || "A magical surprise experience curated specially for your loved ones."}
                      </p>

                      <div className="mt-auto flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-wwTextSecondary uppercase tracking-widest font-bold">Starts from</span>
                          <br />
                          <span className="text-xl font-bold text-white">₹{pkg.price}</span>
                        </div>
                        <motion.div
                          whileHover={{ x: 5 }}
                          className="w-10 h-10 rounded-full border border-wwGold/20 flex items-center justify-center text-wwGold group-hover:bg-wwGold group-hover:text-wwPrimary transition-all duration-300"
                        >
                          →
                        </motion.div>
                      </div>
                    </div>

                    {/* Hover Shimmer */}
                    <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-25deg] group-hover:translate-x-[200%] transition-transform duration-1000 pointer-events-none" />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
