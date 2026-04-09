import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaPaperPlane, FaSmile, FaRegSmile, FaHeart } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Feedback() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.fullName || '',
    email: user?.email || '',
    rating: 5,
    category: 'Service',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`http://${window.location.hostname}:5000/api/feedback`, {
        ...formData,
        userId: user?._id || null
      });
      toast.success('Thank you for your magical feedback!', {
        icon: '✨',
        style: {
          borderRadius: '10px',
          background: '#1a1f2e',
          color: '#fff',
          border: '1px solid rgba(255, 184, 48, 0.2)'
        }
      });
      setFormData({ ...formData, message: '', rating: 5 });
    } catch (err) {
      toast.error('Failed to send feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-wwPrimary pt-32 pb-20 px-4 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-wwGold rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-wwCoral rounded-full blur-[150px]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-wwGold text-xs font-black uppercase tracking-[0.4em] mb-4 block animate-pulse">Share the Magic</span>
          <h1 className="text-4xl md:text-6xl font-playfair font-bold text-white mb-6">Your Experience Matters</h1>
          <p className="text-wwTextSecondary max-w-2xl mx-auto font-dm text-lg leading-relaxed">
            Help us sprinkle more magic onto every journey. Whether it was a moment of joy or room for improvement, your wings help us fly higher.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-2 space-y-6"
          >
            <div className="ww-glass p-8 border-white/5 bg-white/2">
              <h3 className="text-wwGold font-playfair text-2xl mb-4">Why Feedback?</h3>
              <p className="text-wwTextSecondary text-sm leading-relaxed mb-6 font-dm">
                Every wish we fulfill is built on the love and expectations of our community. Your insights direct our flight path.
              </p>
              <div className="space-y-4">
                {[
                  { icon: <FaHeart className="text-wwCoral" />, text: "Built on love" },
                  { icon: <FaStar className="text-wwGold" />, text: "Refined by you" },
                  { icon: <FaPaperPlane className="text-blue-400" />, text: "Sent with hope" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-white/80 text-xs font-bold uppercase tracking-widest">
                    <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>

            <div className="ww-glass p-8 border-wwGold/10 bg-wwGold/5">
              <p className="text-wwGold font-dancing text-2xl text-center">
                "Small wings, big dreams, and a community of hearts."
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="md:col-span-3"
          >
            <form onSubmit={handleSubmit} className="ww-glass p-8 md:p-12 border-white/10 relative overflow-hidden">
              {/* Shimmer Effect */}
              <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-25deg] animate-shimmer pointer-events-none" />

              <div className="space-y-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-wwGold tracking-[0.2em]">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-sm py-3 px-4 text-white outline-none focus:border-wwGold transition-all font-dm"
                      placeholder="e.g. Karna"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-wwGold tracking-[0.2em]">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-sm py-3 px-4 text-white outline-none focus:border-wwGold transition-all font-dm"
                      placeholder="karna@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-bold text-wwGold tracking-[0.2em]">Overall Rating</label>
                  <div className="flex items-center gap-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className={`text-3xl transition-all duration-300 transform hover:scale-125 ${
                          star <= formData.rating ? 'text-wwGold drop-shadow-[0_0_10px_rgba(255,184,48,0.5)]' : 'text-white/10'
                        }`}
                      >
                        <FaStar />
                      </button>
                    ))}
                    <span className="ml-4 text-wwGold font-bold text-lg">{formData.rating}/5</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-bold text-wwGold tracking-[0.2em]">Category</label>
                  <div className="flex flex-wrap gap-3">
                    {['Service', 'Experience', 'Platform', 'Other'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: cat })}
                        className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                          formData.category === cat 
                            ? 'bg-wwGold text-wwPrimary shadow-[0_0_20px_rgba(255,184,48,0.3)]' 
                            : 'bg-white/5 text-wwTextSecondary hover:bg-white/10'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-wwGold tracking-[0.2em]">Your Message</label>
                  <textarea
                    rows="4"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-sm py-3 px-4 text-white outline-none focus:border-wwGold transition-all font-dm resize-none"
                    placeholder="Tell us about your experience..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="ww-button-gold w-full py-4 uppercase font-bold tracking-[0.3em] flex items-center justify-center gap-3 group"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-wwPrimary border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Cast Your Feedback
                      <FaPaperPlane className="text-xs group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-300" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
