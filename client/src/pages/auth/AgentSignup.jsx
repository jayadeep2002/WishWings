import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function AgentSignup() {
  const [formData, setFormData] = useState({
    fullName: '', email: '', password: '', phone: '', city: '', state: '', 
    pincodesServed: '', bio: '', servicesOffered: []
  });
  const [idProof, setIdProof] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const servicesList = ['Decoration', 'Cake Arrangement', 'Gifts', 'Flowers', 'Video Call Setup', 'Photography'];

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});
  
  const handleCheckbox = (service) => {
    setFormData(prev => {
      const current = prev.servicesOffered;
      if (current.includes(service)) return { ...prev, servicesOffered: current.filter(s => s !== service) };
      return { ...prev, servicesOffered: [...current, service] };
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    // In a real app, we would use FormData for file upload. 
    // For this demo, we'll simulate the submission.
    try {
      const res = await axios.post(`http://${window.location.hostname}:5000/api/auth/agent/register`, formData);
      toast.success("Your application is under review. Admin will approve your profile before you can start working.", {
        duration: 8000,
        icon: '📝'
      });
      navigate('/agent/login');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-wwPrimary p-6 md:p-12 relative overflow-hidden flex items-center justify-center">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-wwGold/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-wwCoral/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl ww-glass p-8 md:p-12 relative z-10"
      >
        <div className="flex flex-col md:flex-row gap-12">
          {/* Left Side: Info */}
          <div className="md:w-1/3 border-b md:border-b-0 md:border-r border-white/10 pb-8 md:pb-0 md:pr-12">
            <img src="/logo.png" alt="Logo" className="w-16 h-16 mb-6 animate-pulse-gold cursor-pointer" onClick={() => navigate('/')} />
            <h2 className="text-3xl font-playfair font-bold text-white mb-4">Partner Application</h2>
            <p className="text-wwTextSecondary font-dm text-sm leading-relaxed mb-6">
              Join India's most heartfelt surprise network. Become an agent and help us bridge the distance between loved ones.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-wwGold text-xs font-bold uppercase tracking-wider">
                <span className="w-6 h-6 rounded-full bg-wwGold/20 flex items-center justify-center">1</span>
                Submit Application
              </div>
              <div className="flex items-center gap-3 text-wwTextSecondary text-xs font-bold uppercase tracking-wider">
                <span className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center">2</span>
                Admin Review
              </div>
              <div className="flex items-center gap-3 text-wwTextSecondary text-xs font-bold uppercase tracking-wider">
                <span className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center">3</span>
                Start Working
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="md:w-2/3 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar">
            <form onSubmit={handleSignup} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-wwGold tracking-[0.2em]">Full Name</label>
                  <input type="text" name="fullName" required onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-sm py-2 px-4 text-white outline-none focus:border-wwGold text-sm" placeholder="Full Name" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-wwGold tracking-[0.2em]">Email</label>
                  <input type="email" name="email" required onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-sm py-2 px-4 text-white outline-none focus:border-wwGold text-sm" placeholder="agent@example.com" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-wwGold tracking-[0.2em]">Password</label>
                  <input type="password" name="password" required onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-sm py-2 px-4 text-white outline-none focus:border-wwGold text-sm" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-wwGold tracking-[0.2em]">Phone</label>
                  <input type="tel" name="phone" required onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-sm py-2 px-4 text-white outline-none focus:border-wwGold text-sm" placeholder="+91 00000 00000" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-wwGold tracking-[0.2em]">City in India</label>
                  <input type="text" name="city" required onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-sm py-2 px-4 text-white outline-none focus:border-wwGold text-sm" placeholder="e.g. Hyderabad" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-wwGold tracking-[0.2em]">State</label>
                  <input type="text" name="state" required onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-sm py-2 px-4 text-white outline-none focus:border-wwGold text-sm" placeholder="e.g. Telangana" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-wwGold tracking-[0.2em]">Pincodes Served (Comma Separated)</label>
                <input type="text" name="pincodesServed" required onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-sm py-2 px-4 text-white outline-none focus:border-wwGold text-sm" placeholder="500001, 500002..." />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-wwGold tracking-[0.2em]">My Bio / Experience</label>
                <textarea name="bio" rows="3" required onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-sm py-2 px-4 text-white outline-none focus:border-wwGold text-sm resize-none" placeholder="Tell us about yourself..."></textarea>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] uppercase font-bold text-wwGold tracking-[0.2em]">Services Offered</label>
                <div className="grid grid-cols-2 gap-4">
                  {servicesList.map(service => (
                    <label key={service} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        onChange={() => handleCheckbox(service)} 
                        checked={formData.servicesOffered.includes(service)} 
                        className="accent-wwGold"
                      />
                      <span className="text-xs text-wwTextSecondary group-hover:text-white transition-colors">{service}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] uppercase font-bold text-wwGold tracking-[0.2em]">ID Proof (Aadhaar/PAN)</label>
                <div className="w-full h-32 border-2 border-dashed border-white/10 rounded-sm flex flex-col items-center justify-center relative hover:border-wwGold transition-colors cursor-pointer overflow-hidden">
                  <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    onChange={(e) => setIdProof(e.target.files[0])}
                    accept="image/*"
                  />
                  {idProof ? (
                    <p className="text-wwGold text-xs font-bold">{idProof.name}</p>
                  ) : (
                    <>
                      <span className="text-3xl mb-2">📁</span>
                      <span className="text-[10px] text-wwTextSecondary uppercase font-bold">Upload Document Image</span>
                    </>
                  )}
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                disabled={loading}
                className="w-full ww-button-gold py-4 rounded-sm text-wwPrimary font-bold uppercase tracking-widest text-sm"
              >
                {loading ? 'Submitting Application...' : 'Apply as Partner'}
              </motion.button>
            </form>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-wwTextSecondary border-t border-white/5 pt-6">
          Already an agent? 
          <Link to="/agent/login" className="text-wwGold ml-2 font-bold hover:underline">Log in</Link>
        </div>
      </motion.div>
    </div>
  );
}
