import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function AgentLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginAgent } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/agent/login', { email, password });
      
      // Strict Approval Check
      if (!res.data.agent.isApproved) {
        toast.error("Your account is pending admin approval. Please wait.", {
          duration: 5000,
          icon: '⏳'
        });
        setLoading(false);
        return;
      }

      loginAgent(res.data.token, res.data.agent);
      toast.success('Agent Portal Accessed!');
      navigate('/agent/dashboard');
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

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md ww-glass p-10 relative z-10"
      >
        <div className="text-center mb-10">
          <img src="/logo.png" alt="Logo" className="w-16 h-16 mx-auto mb-4 animate-pulse-gold cursor-pointer" onClick={() => navigate('/')} />
          <h2 className="text-3xl font-playfair font-bold text-white mb-2">Agent Portal</h2>
          <p className="text-wwTextSecondary font-dm text-sm">Fulfill wishes and manage your partner account.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-wwGold font-bold">Partner Email</label>
            <input 
              type="email" required 
              value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="agent@wishwings.in"
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

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={loading}
            className="w-full ww-button-gold py-4 rounded-sm text-wwPrimary font-bold uppercase tracking-widest text-sm relative overflow-hidden group shadow-[0_0_15px_rgba(255,184,48,0.3)]"
          >
            {loading ? 'Verifying...' : 'Access Portal'}
          </motion.button>
        </form>

        <div className="mt-4 text-center">
          <Link to="/forgot-password" className="text-wwGold text-xs hover:underline tracking-wide">Forgot password?</Link>
        </div>

        <div className="mt-6 text-center text-sm text-wwTextSecondary">
          Want to become an agent? 
          <Link to="/agent/signup" className="text-wwGold ml-2 font-bold hover:underline tracking-wide">Apply Now</Link>
        </div>
      </motion.div>
    </div>
  );
}
