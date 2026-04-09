import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function UserLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`http://${window.location.hostname}:5000/api/auth/user/login`, { email, password });
      loginUser(res.data.token, res.data.user);
      toast.success('Welcome back to Wish Wi  ngs!');
      navigate('/user/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-wwPrimary relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-wwGold/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-wwCoral/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md ww-glass p-10 relative z-10"
      >
        <div className="text-center mb-10">
          <img src="/logo.png" alt="Logo" className="w-20 h-20 mx-auto mb-4 animate-pulse-gold cursor-pointer" onClick={() => navigate('/')} />
          <h2 className="text-3xl font-playfair font-bold text-white mb-2">User Login</h2>
          <p className="text-wwTextSecondary font-dm text-sm">Welcome back! Please enter your details.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-wwGold font-bold">Email Address</label>
            <input 
              type="email" required 
              value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full bg-white/5 border border-white/10 rounded-sm py-3 px-4 text-white outline-none focus:border-wwGold transition-all font-dm text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-wwGold font-bold">Password</label>
            <input 
              type="password" required 
              value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-sm py-3 px-4 text-white outline-none focus:border-wwGold transition-all font-dm text-sm"
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-wwTextSecondary cursor-pointer">
              <input type="checkbox" className="accent-wwGold" />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-wwGold hover:underline">Forgot password?</Link>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={loading}
            className="w-full ww-button-gold py-4 rounded-sm text-wwPrimary font-bold uppercase tracking-widest text-sm relative overflow-hidden group"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
          </motion.button>
        </form>

        <div className="mt-8 text-center text-sm text-wwTextSecondary">
          Don't have an account? 
          <Link to="/user/signup" className="text-wwGold ml-2 font-bold hover:underline tracking-wide">Join the family</Link>
        </div>
      </motion.div>
    </div>
  );
}
