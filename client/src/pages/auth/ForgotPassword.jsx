import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const STEPS = { EMAIL: 1, OTP: 2, PASSWORD: 3, SUCCESS: 4 };

export default function ForgotPassword() {
  const [step, setStep] = useState(STEPS.EMAIL);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();
  const otpRefs = useRef([]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => setResendTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  // ─── Step 1: Send OTP ─────────────────────────────────
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`http://${window.location.hostname}:5000/api/auth/forgot-password`, { email, role });
      toast.success('OTP sent to your email!');
      setStep(STEPS.OTP);
      setResendTimer(60);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // ─── Resend OTP ───────────────────────────────────────
  const handleResend = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    try {
      await axios.post(`http://${window.location.hostname}:5000/api/auth/forgot-password`, { email, role });
      toast.success('New OTP sent!');
      setResendTimer(60);
      setOtp(['', '', '', '', '', '']);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  // ─── OTP Input Handlers ───────────────────────────────
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (paste.length === 6) {
      setOtp(paste.split(''));
      otpRefs.current[5]?.focus();
    }
  };

  // ─── Step 2: Verify OTP ───────────────────────────────
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`http://${window.location.hostname}:5000/api/auth/verify-otp`, { email, otp: otpString });
      toast.success('OTP verified!');
      setStep(STEPS.PASSWORD);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  // ─── Step 3: Reset Password ───────────────────────────
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`http://${window.location.hostname}:5000/api/auth/reset-password`, {
        email, otp: otp.join(''), newPassword, role
      });
      toast.success('Password reset successfully!');
      setStep(STEPS.SUCCESS);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  // ─── Step Indicator ───────────────────────────────────
  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[1, 2, 3, 4].map((s) => (
        <div key={s} className="flex items-center gap-2">
          <motion.div
            animate={{
              scale: step === s ? 1.2 : 1,
              backgroundColor: step >= s ? '#FFB830' : 'rgba(255,255,255,0.1)',
            }}
            className="w-3 h-3 rounded-full"
            transition={{ type: 'spring', stiffness: 300 }}
          />
          {s < 4 && (
            <div className={`w-8 h-0.5 transition-colors duration-300 ${step > s ? 'bg-wwGold' : 'bg-white/10'}`} />
          )}
        </div>
      ))}
    </div>
  );

  // ─── Password Strength Indicator ──────────────────────
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { level: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 2) return { level: score, label: 'Weak', color: '#ef4444' };
    if (score <= 3) return { level: score, label: 'Medium', color: '#f59e0b' };
    return { level: score, label: 'Strong', color: '#22c55e' };
  };

  const strength = getPasswordStrength(newPassword);

  // ─── Slide Animation Variants ─────────────────────────
  const slideVariants = {
    enter: { opacity: 0, x: 30 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-wwPrimary relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-wwGold/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-wwCoral/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Floating particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-wwGold/30 rounded-full pointer-events-none"
          style={{ left: `${20 + i * 15}%`, top: `${10 + i * 18}%` }}
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md ww-glass p-10 relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-6">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-16 h-16 mx-auto mb-4 animate-pulse-gold cursor-pointer"
            onClick={() => navigate('/')}
          />
        </div>

        <StepIndicator />

        <AnimatePresence mode="wait">
          {/* ═══════ Step 1: Email ═══════ */}
          {step === STEPS.EMAIL && (
            <motion.div key="email" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-wwGold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🔐</span>
                </div>
                <h2 className="text-2xl font-playfair font-bold text-white mb-2">Forgot Password?</h2>
                <p className="text-wwTextSecondary font-dm text-sm">No worries! Enter your email and we'll send you an OTP.</p>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-wwGold font-bold">Email Address</label>
                  <input
                    type="email" required
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    className="w-full bg-white/5 border border-white/10 rounded-sm py-3 px-4 text-white outline-none focus:border-wwGold transition-all font-dm text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-wwGold font-bold">Account Type</label>
                  <div className="flex gap-3">
                    {['user', 'agent'].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`flex-1 py-3 rounded-sm text-sm font-bold uppercase tracking-widest transition-all duration-300 ${
                          role === r
                            ? 'bg-wwGold text-wwPrimary shadow-[0_0_15px_rgba(255,184,48,0.3)]'
                            : 'bg-white/5 text-wwTextSecondary border border-white/10 hover:border-wwGold/50'
                        }`}
                      >
                        {r === 'user' ? '👤 User' : '🛡️ Agent'}
                      </button>
                    ))}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full ww-button-gold py-4 rounded-sm text-wwPrimary font-bold uppercase tracking-widest text-sm relative overflow-hidden group"
                >
                  {loading ? 'Sending...' : 'Send OTP'}
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                </motion.button>
              </form>

              <div className="mt-6 text-center text-sm text-wwTextSecondary">
                Remember your password?{' '}
                <Link to="/user/login" className="text-wwGold font-bold hover:underline tracking-wide">Sign In</Link>
              </div>
            </motion.div>
          )}

          {/* ═══════ Step 2: OTP ═══════ */}
          {step === STEPS.OTP && (
            <motion.div key="otp" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-wwGold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📧</span>
                </div>
                <h2 className="text-2xl font-playfair font-bold text-white mb-2">Verify OTP</h2>
                <p className="text-wwTextSecondary font-dm text-sm">
                  Enter the 6-digit code sent to<br />
                  <span className="text-wwGold font-semibold">{email}</span>
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                {/* OTP Digit Inputs */}
                <div className="flex justify-center gap-3" onPaste={handleOtpPaste}>
                  {otp.map((digit, index) => (
                    <motion.input
                      key={index}
                      ref={(el) => (otpRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`w-12 h-14 text-center text-xl font-bold rounded-lg outline-none transition-all duration-300 font-dm ${
                        digit
                          ? 'bg-wwGold/15 border-2 border-wwGold text-wwGold shadow-[0_0_10px_rgba(255,184,48,0.2)]'
                          : 'bg-white/5 border-2 border-white/10 text-white focus:border-wwGold'
                      }`}
                    />
                  ))}
                </div>

                {/* Timer & Resend */}
                <div className="text-center">
                  {resendTimer > 0 ? (
                    <p className="text-wwTextSecondary text-sm">
                      Resend OTP in <span className="text-wwGold font-bold">{resendTimer}s</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={loading}
                      className="text-wwGold text-sm font-bold hover:underline tracking-wide"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading || otp.join('').length !== 6}
                  className="w-full ww-button-gold py-4 rounded-sm text-wwPrimary font-bold uppercase tracking-widest text-sm relative overflow-hidden group disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                </motion.button>
              </form>

              <button
                onClick={() => setStep(STEPS.EMAIL)}
                className="mt-4 w-full text-center text-sm text-wwTextSecondary hover:text-wwGold transition-colors"
              >
                ← Change email address
              </button>
            </motion.div>
          )}

          {/* ═══════ Step 3: New Password ═══════ */}
          {step === STEPS.PASSWORD && (
            <motion.div key="password" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-wwGold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🔑</span>
                </div>
                <h2 className="text-2xl font-playfair font-bold text-white mb-2">New Password</h2>
                <p className="text-wwTextSecondary font-dm text-sm">Create a strong new password for your account.</p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-wwGold font-bold">New Password</label>
                  <input
                    type="password" required
                    value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    minLength={6}
                    className="w-full bg-white/5 border border-white/10 rounded-sm py-3 px-4 text-white outline-none focus:border-wwGold transition-all font-dm text-sm"
                  />
                  {/* Password Strength Bar */}
                  {newPassword && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1 mt-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className="h-1 flex-1 rounded-full transition-all duration-300"
                            style={{
                              backgroundColor: i <= strength.level ? strength.color : 'rgba(255,255,255,0.1)',
                            }}
                          />
                        ))}
                      </div>
                      <p className="text-xs font-dm" style={{ color: strength.color }}>
                        {strength.label}
                      </p>
                    </motion.div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-wwGold font-bold">Confirm Password</label>
                  <input
                    type="password" required
                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    minLength={6}
                    className={`w-full bg-white/5 border rounded-sm py-3 px-4 text-white outline-none transition-all font-dm text-sm ${
                      confirmPassword && confirmPassword !== newPassword
                        ? 'border-red-500/50 focus:border-red-500'
                        : confirmPassword && confirmPassword === newPassword
                        ? 'border-green-500/50 focus:border-green-500'
                        : 'border-white/10 focus:border-wwGold'
                    }`}
                  />
                  {confirmPassword && confirmPassword !== newPassword && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-xs font-dm">
                      Passwords do not match
                    </motion.p>
                  )}
                  {confirmPassword && confirmPassword === newPassword && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-400 text-xs font-dm">
                      ✓ Passwords match
                    </motion.p>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading || newPassword !== confirmPassword || newPassword.length < 6}
                  className="w-full ww-button-gold py-4 rounded-sm text-wwPrimary font-bold uppercase tracking-widest text-sm relative overflow-hidden group disabled:opacity-50"
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                </motion.button>
              </form>
            </motion.div>
          )}

          {/* ═══════ Step 4: Success ═══════ */}
          {step === STEPS.SUCCESS && (
            <motion.div key="success" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
              <div className="text-center py-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-500/30"
                >
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-5xl"
                  >
                    ✅
                  </motion.span>
                </motion.div>
                <h2 className="text-2xl font-playfair font-bold text-white mb-3">Password Reset!</h2>
                <p className="text-wwTextSecondary font-dm text-sm mb-8 leading-relaxed">
                  Your password has been successfully reset.<br />
                  You can now log in with your new password.
                </p>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(role === 'agent' ? '/agent/login' : '/user/login')}
                  className="w-full ww-button-gold py-4 rounded-sm text-wwPrimary font-bold uppercase tracking-widest text-sm relative overflow-hidden group"
                >
                  Go to Login
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
