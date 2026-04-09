import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FaBox, FaUser, FaHistory, FaMapMarkerAlt, FaVideo, FaSignOutAlt, FaCalendarAlt, FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../../utils/getImageUrl';


export default function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = sessionStorage.getItem('wishwings_user_token');
        const res = await axios.get(`http://${window.location.hostname}:5000/api/bookings/my-bookings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(res.data.bookings);
      } catch (err) {
        toast.error('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchBookings();
  }, [user]);

  if (loading) return (
    <div className="min-h-screen bg-wwPrimary flex flex-col justify-center items-center gap-4">
      <div className="w-12 h-12 border-4 border-wwGold border-t-transparent rounded-full animate-spin"></div>
      <p className="text-wwGold font-bold uppercase tracking-widest text-xs">Syncing Dashboard...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-wwPrimary pt-28 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-80 space-y-6"
          >
            {/* Profile Card */}
            <div className="ww-glass p-8 border-white/5 text-center">
               <div className="w-24 h-24 bg-wwGold/10 border border-wwGold/30 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 text-wwGold shadow-[0_0_20px_rgba(255,184,48,0.1)] overflow-hidden">
                 {user?.profilePhoto ? (
                   <img src={getImageUrl(user.profilePhoto)} alt="Profile" className="w-full h-full object-cover" />
                 ) : (
                   user?.fullName.charAt(0)
                 )}
               </div>

               <h2 className="text-xl font-playfair font-bold text-white mb-1">{user?.fullName}</h2>
               <p className="text-wwTextSecondary text-xs font-dm uppercase tracking-widest">{user?.email}</p>
               <button 
                 onClick={logout}
                 className="mt-6 flex items-center justify-center gap-2 w-full py-2 text-wwCoral text-[10px] font-bold uppercase tracking-widest border border-wwCoral/20 hover:bg-wwCoral/5 transition-all"
               >
                 <FaSignOutAlt /> Sign Out
               </button>
            </div>

            {/* Menu Links */}
            <div className="ww-glass overflow-hidden border-white/5">
                {[
                  { icon: <FaBox />, label: 'My Bookings', active: true, onClick: () => navigate('/user/dashboard') },
                  { icon: <FaHeart />, label: 'Wishlist', onClick: () => navigate('/user/wishlist') },
                  { icon: <FaUser />, label: 'Profile Settings', onClick: () => navigate('/user/profile') },
                  { icon: <FaHistory />, label: 'Transaction History', onClick: () => navigate('/user/transactions') },
                ].map((item, i) => (
                  <button 
                    key={i} 
                    onClick={item.onClick}
                    className={`flex items-center gap-4 w-full p-5 text-sm font-dm transition-all border-b border-white/5 last:border-0 ${item.active ? 'text-wwGold bg-white/5' : 'text-wwTextSecondary hover:bg-white/5 hover:text-white'}`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="uppercase tracking-widest font-bold text-xs">{item.label}</span>
                  </button>
                ))}
            </div>
          </motion.div>

          {/* Main Content Area */}
          <div className="flex-grow space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-playfair font-bold text-white">Active Surprises</h1>
              <button 
                onClick={() => navigate('/packages')}
                className="ww-button-gold !px-6 !py-2 text-[10px] tracking-widest border-none"
              >
                Book New Gift
              </button>
            </div>

            {bookings.length === 0 ? (
              <div className="ww-glass p-20 text-center border-white/5">
                 <div className="text-6xl mb-6 opacity-30">🎁</div>
                 <h3 className="text-2xl font-playfair font-bold text-white mb-2">No Active Wishes</h3>
                 <p className="text-wwTextSecondary font-dm text-sm mb-8">You haven't booked any experiences yet. Start bridging the distance today.</p>
                 <button onClick={() => navigate('/packages')} className="text-wwGold font-bold uppercase tracking-widest text-xs hover:underline">Explore Packages →</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {bookings.map((booking) => (
                  <motion.div 
                    key={booking._id} 
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="ww-glass p-6 md:p-8 border-white/5 flex flex-col md:flex-row gap-8 hover:border-wwGold/20 transition-all group"
                  >
                    {/* Booking Image */}
                    <div className="w-full md:w-32 h-32 bg-wwCard/50 rounded-sm overflow-hidden border border-white/5 shrink-0 relative">
                       <img src="https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=400&q=80" alt="Booking" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                       <div className="absolute inset-0 bg-wwPrimary/40" />
                    </div>

                    {/* Booking Info */}
                    <div className="flex-grow space-y-4">
                       <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                          <div>
                             <h4 className="text-xl font-playfair font-bold text-white group-hover:text-wwGold transition-colors">{booking.package?.name || 'Custom Surprise'}</h4>
                             <p className="text-wwTextSecondary text-xs font-dm">Recipient: <span className="text-white font-bold">{booking.recipientName}</span></p>
                          </div>
                          <div className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest ${
                            booking.bookingStatus === 'completed' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 
                            booking.bookingStatus === 'cancelled' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 
                            'bg-wwGold/10 text-wwGold border border-wwGold/20'
                          }`}>
                            {booking.bookingStatus}
                          </div>
                       </div>

                       <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4 border-t border-white/5">
                          <div className="space-y-1">
                             <p className="text-[10px] text-wwTextSecondary uppercase font-bold tracking-widest">Planned Date</p>
                             <div className="flex items-center gap-2 text-white text-sm font-dm">
                                <FaCalendarAlt className="text-wwGold text-xs" />
                                {new Date(booking.eventDate).toLocaleDateString()}
                             </div>
                          </div>
                          <div className="space-y-1">
                             <p className="text-[10px] text-wwTextSecondary uppercase font-bold tracking-widest">Price</p>
                             <p className="text-white font-bold text-sm">₹{booking.totalAmount}</p>
                          </div>
                          <div className="col-span-2 md:col-span-1 flex gap-2 pt-2 md:pt-0">
                             <button 
                               onClick={() => navigate(`/user/track/${booking._id}`)}
                               className="flex-1 ww-button-gold !py-2 !text-[10px] !px-4 !tracking-widest"
                             >
                               Track Status
                             </button>
                             {booking.bookingStatus === 'completed' && (
                               <button 
                                 onClick={() => navigate(`/user/vault/${booking._id}`)}
                                 className="flex-1 border border-white/20 text-white font-bold py-2 rounded-sm text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all"
                               >
                                 Open Vault
                               </button>
                             )}
                          </div>
                       </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
