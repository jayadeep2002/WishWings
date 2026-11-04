import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PackageCard from '../components/PackageCard';
import { FaSearch, FaChevronDown, FaGift } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import API_URL from '../utils/apiConfig';

export default function Packages() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOccasion, setSelectedOccasion] = useState('');
  const [showAllOccasions, setShowAllOccasions] = useState(false);
  const [wishlistIds, setWishlistIds] = useState([]);

  const occasions = [
    { value: 'Birthday', emoji: '🎂' },
    { value: 'Anniversary', emoji: '💍' },
    { value: 'Welcome Home', emoji: '🏠' },
    { value: 'Baby Shower', emoji: '👶' },
    { value: 'Graduation', emoji: '🎓' },
    { value: 'Engagement', emoji: '💑' },
    { value: 'Wedding', emoji: '💒' },
    { value: 'Housewarming', emoji: '🏡' },
    { value: 'Retirement', emoji: '🎉' },
    { value: "Valentine's Day", emoji: '❤️' },
    { value: "Mother's Day", emoji: '👩' },
    { value: "Father's Day", emoji: '👨' },
    { value: 'Farewell', emoji: '👋' },
    { value: 'Promotion', emoji: '🏆' },
    { value: 'Custom', emoji: '🎨' },
  ];

  const visibleOccasions = showAllOccasions ? occasions : occasions.slice(0, 6);

 useEffect(() => {
    const fetchPackages = async () => {
      try {
        const packagesRes = await axios.get(`${API_URL}/api/packages`); // Unique name
        setPackages(packagesRes.data.packages);
      } catch (err) {
        console.error("Failed to load packages");
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  useEffect(() => {
    const fetchWishlistIds = async () => {
      if (!user) return;
      try {
        const token = sessionStorage.getItem('wishwings_user_token');
        const wishlistRes = await axios.get(`${API_URL}/api/wishlist/ids`, { // Unique name
          headers: { Authorization: `Bearer ${token}` }
        });
        setWishlistIds(wishlistRes.data.packageIds);
      } catch { /* silent */ }
    };
    fetchWishlistIds();
  }, [user]);

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOccasion = !selectedOccasion || pkg.category?.toLowerCase() === selectedOccasion.toLowerCase();
    return matchesSearch && matchesOccasion;
  });

  return (
    <div className="min-h-screen bg-wwPrimary pt-28 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Left Filter Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full md:w-64 space-y-8"
          >
            <div className="ww-glass p-6 border-white/5 h-fit">
              <div className="flex items-center gap-2 text-wwGold mb-6">
                <FaGift className="text-xs" />
                <h2 className="text-xs uppercase tracking-[0.3em] font-bold">Choose Occasion</h2>
              </div>
              
              <div className="space-y-3">
                {/* All Packages Option */}
                <button
                  onClick={() => setSelectedOccasion('')}
                  className={`w-full flex items-center gap-3 py-2.5 px-3 rounded-sm text-left text-sm font-dm transition-all duration-200 ${
                    !selectedOccasion
                      ? 'bg-wwGold/15 text-wwGold border border-wwGold/30'
                      : 'text-wwTextSecondary hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <span className="text-base">🎁</span>
                  <span className="font-bold">All Occasions</span>
                </button>

                <div className="border-t border-white/5 pt-2" />

                {/* Occasion List */}
                <div className="flex flex-col gap-1">
                  {visibleOccasions.map(occ => (
                    <button
                      key={occ.value}
                      onClick={() => setSelectedOccasion(selectedOccasion === occ.value ? '' : occ.value)}
                      className={`flex items-center gap-3 py-2 px-3 rounded-sm text-left text-sm font-dm transition-all duration-200 ${
                        selectedOccasion === occ.value
                          ? 'bg-wwGold/15 text-wwGold border border-wwGold/30'
                          : 'text-wwTextSecondary hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <span className="text-base">{occ.emoji}</span>
                      <span>{occ.value}</span>
                    </button>
                  ))}
                </div>
                {occasions.length > 6 && (
                  <button
                    onClick={() => setShowAllOccasions(!showAllOccasions)}
                    className="flex items-center gap-2 text-wwGold text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors pt-1"
                  >
                    <FaChevronDown className={`transition-transform duration-300 ${showAllOccasions ? 'rotate-180' : ''}`} />
                    {showAllOccasions ? 'Show Less' : `Show All (${occasions.length})`}
                  </button>
                )}
                {selectedOccasion && (
                  <button
                    onClick={() => setSelectedOccasion('')}
                    className="text-wwCoral text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors"
                  >
                    ✕ Clear Occasion
                  </button>
                )}
              </div>
            </div>

            {/* Need Help Card */}
            <div className="ww-glass p-6 border-wwGold/10 bg-wwGold/5">
              <h4 className="text-white font-playfair font-bold mb-2">Need a Custom Surprise?</h4>
              <p className="text-wwTextSecondary text-xs font-dm leading-relaxed mb-4">
                Can't find what you're looking for? Let our experts help you plan a unique moment.
              </p>
              <button className="text-wwGold text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">
                Contact Events Team →
              </button>
            </div>
          </motion.div>

          {/* Main Product Grid Area */}
          <div className="flex-grow space-y-8">
            {/* Search and Sort Header */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative w-full sm:max-w-md">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-wwTextSecondary text-xs" />
                <input 
                  type="text" 
                  placeholder="Search for magic..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-sm py-3 pl-10 pr-4 text-white outline-none focus:border-wwGold transition-all font-dm text-sm"
                />
              </div>
              <p className="text-wwTextSecondary text-xs font-bold uppercase tracking-widest">
                Showing <span className="text-wwGold">{filteredPackages.length}</span> Results
              </p>
            </div>

            {/* Selected Occasion Banner */}
            {selectedOccasion && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between bg-wwGold/10 border border-wwGold/20 rounded-sm px-5 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{occasions.find(o => o.value === selectedOccasion)?.emoji}</span>
                  <div>
                    <p className="text-white font-bold text-sm">Browsing for {selectedOccasion}</p>
                    <p className="text-wwTextSecondary text-[10px] font-dm">All packages below are perfect for this occasion</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedOccasion('')}
                  className="text-wwGold text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
                >
                  ✕ Clear
                </button>
              </motion.div>
            )}

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="ww-glass h-80 animate-pulse border-white/5"></div>
                ))}
              </div>
            ) : filteredPackages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                  {filteredPackages.map((pkg, i) => (
                    <motion.div 
                      key={pkg._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <PackageCard pkg={pkg} isWishlisted={wishlistIds.includes(pkg._id)} selectedOccasion={selectedOccasion} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="ww-glass p-20 text-center border-white/5">
                <div className="text-5xl mb-6">🔍</div>
                <h3 className="text-2xl font-playfair font-bold text-white mb-2">No Surprises Found</h3>
                <p className="text-wwTextSecondary font-dm text-sm">Try adjusting your filters or search terms.</p>
                <button 
                  onClick={() => {setSearchQuery(''); setSelectedCategory('All'); setSelectedOccasion('');}}
                  className="mt-8 text-wwGold font-bold uppercase tracking-widest text-xs hover:underline"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
