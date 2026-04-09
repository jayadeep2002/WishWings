import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FaUser, FaPhone, FaGlobe, FaSave, FaArrowLeft, FaCamera } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../../utils/getImageUrl';


export default function Profile() {
  const { user, loginUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    country: user?.country || '',
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(getImageUrl(user?.profilePhoto) || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        phone: user.phone || '',
        country: user.country || '',
      });
      setPreviewUrl(getImageUrl(user.profilePhoto) || '');
    }
  }, [user]);


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = sessionStorage.getItem('wishwings_user_token');
      const data = new FormData();
      data.append('fullName', formData.fullName);
      data.append('phone', formData.phone);
      data.append('country', formData.country);
      if (profilePhoto) {
        data.append('profilePhoto', profilePhoto);
      }

      const res = await axios.put(`http://${window.location.hostname}:5000/api/user/profile`, data, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (res.data.success) {
        loginUser(token, res.data.user);
        toast.success('Profile updated successfully!');
        navigate('/user/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-wwPrimary pt-28 pb-20 px-4 md:px-8">
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => navigate('/user/dashboard')}
          className="flex items-center gap-2 text-wwGold mb-8 text-sm uppercase tracking-widest font-bold hover:underline"
        >
          <FaArrowLeft /> Back to Dashboard
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="ww-glass p-8 md:p-12 border-white/5"
        >
          <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
            <div className="relative group">
              <div className="w-24 h-24 bg-wwGold/10 border border-wwGold/30 rounded-full flex items-center justify-center text-4xl text-wwGold overflow-hidden">
                {previewUrl ? (
                  <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <FaUser />
                )}
              </div>
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 bg-wwGold text-wwPrimary rounded-full flex items-center justify-center text-sm shadow-lg hover:scale-110 transition-transform"
              >
                <FaCamera />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-playfair font-bold text-white">Profile Settings</h1>
              <p className="text-wwTextSecondary text-xs font-dm uppercase tracking-widest">Update your personal information</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-wwGold font-bold flex items-center gap-2">
                <FaUser className="text-[10px]" /> Full Name
              </label>
              <input 
                type="text" required 
                value={formData.fullName} 
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-sm py-4 px-5 text-white outline-none focus:border-wwGold transition-all font-dm"
                placeholder="Enter your full name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-wwGold font-bold flex items-center gap-2">
                  <FaPhone className="text-[10px]" /> Phone Number
                </label>
                <input 
                  type="text" 
                  value={formData.phone} 
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-sm py-4 px-5 text-white outline-none focus:border-wwGold transition-all font-dm"
                  placeholder="+91 00000 00000"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-wwGold font-bold flex items-center gap-2">
                  <FaGlobe className="text-[10px]" /> Country
                </label>
                <input 
                  type="text" 
                  value={formData.country} 
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-sm py-4 px-5 text-white outline-none focus:border-wwGold transition-all font-dm"
                  placeholder="e.g. India"
                />
              </div>
            </div>

            <div className="pt-6">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                disabled={loading}
                className="w-full ww-button-gold py-4 rounded-sm text-wwPrimary font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,184,48,0.2)]"
              >
                <FaSave /> {loading ? 'Saving Changes...' : 'Update Profile'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
