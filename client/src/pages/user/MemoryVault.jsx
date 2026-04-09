import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLock, FaArrowLeft, FaPlay, FaImage, FaCalendar, FaUserCheck, FaShareAlt } from 'react-icons/fa';

import { getImageUrl } from '../../utils/getImageUrl';

export default function MemoryVault() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [reactions, setReactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVault = async () => {
      try {
        const token = sessionStorage.getItem('wishwings_user_token');
        const res = await axios.get(`http://${window.location.hostname}:5000/api/reaction-vault/booking/${bookingId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReactions(res.data.reactions);
      } catch (err) {
        toast.error('The Vault is currently locked or inaccessible');
      } finally {
        setLoading(false);
      }
    };
    fetchVault();
  }, [bookingId]);

  if (loading) return (
    <div className="min-h-screen bg-wwPrimary flex flex-col justify-center items-center gap-4">
      <div className="w-12 h-12 border-4 border-wwGold border-t-transparent rounded-full animate-spin"></div>
      <p className="text-wwGold font-bold uppercase tracking-widest text-xs">Unlocking the Vault...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-wwPrimary pt-28 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Cinematic Header */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="ww-glass p-8 md:p-12 border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 bg-gradient-to-r from-wwGold/5 to-transparent"
        >
           <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4 mb-4 text-wwGold">
                 <FaLock className="text-2xl" />
                 <h1 className="text-4xl md:text-5xl font-playfair font-bold text-white">The Memory Vault</h1>
              </div>
              <p className="text-wwTextSecondary font-dm text-lg max-w-xl">
                Relive the magic of the moment your surprise reached its destination. These memories are yours to keep, forever.
              </p>
           </div>
           <button 
             onClick={() => navigate('/user/dashboard')}
             className="flex items-center gap-2 border border-white/20 text-white text-[10px] font-bold px-8 py-3 uppercase tracking-widest hover:bg-white/5 transition-all"
           >
              <FaArrowLeft /> Retun to Orders
           </button>
        </motion.div>

        {reactions.length === 0 ? (
          <div className="ww-glass p-32 text-center border-white/5">
             <div className="w-24 h-24 bg-white/5 border border-dashed border-white/20 rounded-full flex items-center justify-center mb-8 mx-auto opacity-30">
                <FaLock className="text-4xl text-white" />
             </div>
             <h3 className="text-2xl font-playfair font-bold text-white mb-2">The Vault rests in anticipation</h3>
             <p className="text-wwTextSecondary font-dm text-sm max-w-sm mx-auto leading-relaxed">
               As soon as our field agents capture the surprise from the target location, the magical media will materialize here.
             </p>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {reactions.map((item, idx) => (
              <motion.div 
                key={item._id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="ww-glass group overflow-hidden border-white/5 break-inside-avoid"
              >
                <div className="relative bg-wwCard/30 group-hover:scale-[1.02] transition-transform duration-500">
                   {item.mediaType === 'video' ? (
                      <div className="relative aspect-video">
                        <video src={getImageUrl(item.mediaUrl)} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all">
                           <div className="w-12 h-12 bg-wwGold rounded-full flex items-center justify-center text-wwPrimary shadow-2xl scale-1 group-hover:scale-110 transition-transform">
                              <FaPlay className="ml-1" />
                           </div>
                        </div>
                      </div>
                   ) : (
                      <img src={getImageUrl(item.mediaUrl)} alt={item.caption} className="w-full h-auto object-cover" />
                   )}
                   
                   <div className="absolute top-4 right-4 z-10 flex gap-2">
                      <button className="w-8 h-8 rounded-full bg-wwPrimary/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:text-wwGold transition-colors text-xs">
                         <FaShareAlt />
                      </button>
                   </div>
                   
                   <div className="absolute top-4 left-4 bg-wwGold/90 backdrop-blur-md text-wwPrimary px-3 py-1 rounded-sm text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                      {item.mediaType === 'video' ? <FaPlay className="text-[7px]" /> : <FaImage className="text-[7px]" />}
                      {item.mediaType}
                   </div>
                </div>

                <div className="p-6 space-y-4">
                   <p className="text-white font-dm text-sm leading-relaxed italic">
                      " {item.caption || 'A beautiful surprise captured in time.'} "
                   </p>
                   
                   <div className="pt-4 border-t border-white/5 flex justify-between items-center text-[9px] font-bold uppercase tracking-widest">
                      <div className="flex items-center gap-2 text-wwGold">
                         <FaUserCheck />
                         <span>{item.agent?.fullName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-wwTextSecondary">
                         <FaCalendar />
                         <span>{new Date(item.uploadedAt).toLocaleDateString()}</span>
                      </div>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Global Shimmer Overlay */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,184,48,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,184,48,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>
    </div>
  );
}
