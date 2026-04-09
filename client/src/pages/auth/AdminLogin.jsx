import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginAdmin } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/admin/login', { email, password });
      loginAdmin(res.data.token, res.data.admin);
      toast.success('System Access Authorized');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Access denied');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-wwPrimary relative overflow-hidden">
      {/* Background Grid Layer */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#FFB830 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-wwGold/5 rounded-full blur-[150px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md ww-glass p-10 relative z-10 border-wwGold/10"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 mx-auto mb-6 bg-wwGold/10 rounded-full flex items-center justify-center border border-wwGold/20">
             <span className="text-4xl">🔑</span>
          </div>
          <h2 className="text-3xl font-playfair font-bold text-white mb-2">Platform Control</h2>
          <p className="text-wwTextSecondary font-dm text-xs uppercase tracking-widest font-bold">Encrypted Administrator Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-wwGold font-bold">Admin Email</label>
            <input 
              type="email" required 
              value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@wishwings.in"
              className="w-full bg-black/40 border border-white/10 rounded-sm py-3 px-4 text-white outline-none focus:border-wwGold transition-all font-dm text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-wwGold font-bold">Access Passphrase</label>
            <input 
              type="password" required 
              value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-black/40 border border-white/10 rounded-sm py-3 px-4 text-white outline-none focus:border-wwGold transition-all font-dm text-sm"
            />
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={loading}
            className="w-full bg-transparent border border-wwGold text-wwGold py-4 rounded-sm font-bold uppercase tracking-[0.3em] text-xs hover:bg-wwGold hover:text-wwPrimary transition-all duration-300"
          >
            {loading ? 'Decrypting...' : 'Authorize Login'}
          </motion.button>
        </form>

        <div className="mt-8 flex justify-center items-center gap-2 opacity-30 text-[10px] text-white tracking-widest uppercase">
          <div className="w-2 h-2 rounded-full bg-wwGold animate-pulse"></div>
          System Secure
        </div>
      </motion.div>
    </div>
  );
}
