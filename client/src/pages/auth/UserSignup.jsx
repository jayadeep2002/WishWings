import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function UserSignup() {
  const [formData, setFormData] = useState({ 
    fullName: '', 
    email: '', 
    password: '', 
    phone: '', 
    country: 'USA' 
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`http://${window.location.hostname}:5000/api/auth/user/register`, formData);
      sessionStorage.setItem('wishwings_user_token', res.data.token);
      toast.success('Account created! Welcome to Wish Wings.');
      navigate('/user/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const countries = [
    { code: 'USA', label: 'USA', flag: '🇺🇸' },
    { code: 'UK', label: 'UK', flag: '🇬🇧' },
    { code: 'UAE', label: 'UAE', flag: '🇦🇪' },
    { code: 'Canada', label: 'Canada', flag: '🇨🇦' },
    { code: 'Australia', label: 'Australia', flag: '🇦🇺' },
    { code: 'Singapore', label: 'Singapore', flag: '🇸🇬' },
    { code: 'Other', label: 'Other', flag: '🌍' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-wwPrimary relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-wwGold/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-wwCoral/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg ww-glass p-10 relative z-10"
      >
        <div className="text-center mb-8">
          <img src="/logo.png" alt="Logo" className="w-16 h-16 mx-auto mb-4 animate-pulse-gold cursor-pointer" onClick={() => navigate('/')} />
          <h2 className="text-3xl font-playfair font-bold text-white mb-2">Create Account</h2>
          <p className="text-wwTextSecondary font-dm text-sm">Join Wish Wings to start connecting hearts.</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-wwGold font-bold">Full Name</label>
              <input 
                type="text" required name="fullName"
                value={formData.fullName} onChange={handleChange}
                placeholder="John Doe"
                className="w-full bg-white/5 border border-white/10 rounded-sm py-2 px-4 text-white outline-none focus:border-wwGold transition-all font-dm text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-wwGold font-bold">Email Address</label>
              <input 
                type="email" required name="email"
                value={formData.email} onChange={handleChange}
                placeholder="john@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-sm py-2 px-4 text-white outline-none focus:border-wwGold transition-all font-dm text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-wwGold font-bold">Phone Number</label>
              <input 
                type="tel" required name="phone"
                value={formData.phone} onChange={handleChange}
                placeholder="+1 234 567 890"
                className="w-full bg-white/5 border border-white/10 rounded-sm py-2 px-4 text-white outline-none focus:border-wwGold transition-all font-dm text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-wwGold font-bold">Country</label>
              <select 
                name="country" 
                value={formData.country} 
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-sm py-2 px-4 text-white outline-none focus:border-wwGold transition-all font-dm text-sm appearance-none cursor-pointer"
              >
                {countries.map(c => (
                  <option key={c.code} value={c.code} className="bg-wwCard text-white">
                    {c.flag} {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-wwGold font-bold">Password</label>
            <input 
              type="password" required name="password"
              value={formData.password} onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-sm py-2 px-4 text-white outline-none focus:border-wwGold transition-all font-dm text-sm"
            />
          </div>

          <p className="text-[10px] text-wwTextSecondary text-center leading-relaxed">
            By signing up, you agree to our <span className="text-wwGold cursor-pointer hover:underline">Terms of Service</span> and <span className="text-wwGold cursor-pointer hover:underline">Privacy Policy</span>.
          </p>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={loading}
            className="w-full ww-button-gold py-4 rounded-sm text-wwPrimary font-bold uppercase tracking-widest text-sm relative overflow-hidden group"
          >
            {loading ? 'Creating Account...' : 'Sign Up Now'}
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
          </motion.button>
        </form>

        <div className="mt-8 text-center text-sm text-wwTextSecondary">
          Already have an account? 
          <Link to="/user/login" className="text-wwGold ml-2 font-bold hover:underline tracking-wide">Log in here</Link>
        </div>
      </motion.div>
    </div>
  );
}
