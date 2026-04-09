import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCompass, FaMapMarkerAlt, FaUserSecret, FaHeadset, FaArrowLeft, FaClock, FaCheckCircle, FaSatellite } from 'react-icons/fa';

const socket = io('http://localhost:5000');

export default function EmotionDirector() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const token = sessionStorage.getItem('wishwings_user_token');
        const res = await axios.get(`http://localhost:5000/api/bookings/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBooking(res.data.booking);
      } catch (err) {
        toast.error('Connection to Tracking Node Failed');
      } finally {
         setLoading(false);
      }
    };
    fetchBooking();

    socket.emit('join-tracking', id);
    socket.on('location-update', (data) => {
      if (data.bookingId === id) {
        setLocation(data.coords);
      }
    });

    return () => {
      socket.off('location-update');
    };
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-wwPrimary flex flex-col justify-center items-center gap-4">
      <div className="w-12 h-12 border-4 border-wwGold border-t-transparent rounded-full animate-spin"></div>
      <p className="text-wwGold font-bold uppercase tracking-widest text-xs">Initializing Satellite Link...</p>
    </div>
  );
  
  if (!booking) return <div className="min-h-screen bg-wwPrimary flex justify-center items-center text-white">Tracking data encrypted or unavailable.</div>;

  const steps = [
    { label: 'Mission Received', status: 'completed' },
    { label: 'Agent Assigned', status: booking.assignedAgent ? 'completed' : 'pending' },
    { label: 'Execution Phase', status: booking.bookingStatus === 'in_progress' ? 'active' : booking.bookingStatus === 'completed' ? 'completed' : 'pending' },
    { label: 'Mission Accomplished', status: booking.bookingStatus === 'completed' ? 'completed' : 'pending' }
  ];

  return (
    <div className="min-h-screen bg-wwPrimary pt-28 pb-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Bar */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="ww-glass p-6 border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4"
        >
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-wwGold/10 rounded-full flex items-center justify-center text-wwGold border border-wwGold/20">
                 <FaSatellite className="animate-pulse" />
              </div>
              <div>
                 <h2 className="text-xl font-playfair font-bold text-white">Mission Tracking: {booking.occasion}</h2>
                 <p className="text-[10px] text-wwTextSecondary font-bold uppercase tracking-widest">ORDER ID: WW-{booking._id.slice(-8).toUpperCase()}</p>
              </div>
           </div>
           <button 
             onClick={() => navigate('/user/dashboard')}
             className="flex items-center gap-2 text-wwGold text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors"
           >
              <FaArrowLeft /> Retun to Dashboard
           </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Left: Tactical Progress */}
           <div className="lg:col-span-2 space-y-8">
              <div className="ww-glass p-10 border-white/5">
                 <div className="flex items-center justify-between mb-12">
                    <h3 className="text-xs font-bold text-wwGold uppercase tracking-[0.3em]">Operational Milestone</h3>
                    <div className="flex items-center gap-2 text-green-500 text-[10px] font-bold uppercase tracking-widest">
                       <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                       Live Feed
                    </div>
                 </div>
                 
                 <div className="relative flex justify-between items-start">
                    {/* Visual Connector */}
                    <div className="absolute top-6 left-0 w-full h-[1px] bg-white/5 -z-0">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${(steps.filter(s => s.status === 'completed').length - 1) / (steps.length - 1) * 100}%` }}
                         className="h-full bg-wwGold shadow-[0_0_10px_rgba(255,184,48,0.5)] transition-all duration-1000"
                       />
                    </div>

                    {steps.map((step, idx) => (
                       <div key={idx} className="flex flex-col items-center gap-4 relative z-10 w-24">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                            step.status === 'completed' ? 'bg-wwGold border-wwGold text-wwPrimary shadow-[0_0_20px_rgba(255,184,48,0.3)]' : 
                            step.status === 'active' ? 'bg-wwPrimary border-wwGold text-wwGold animate-pulse' : 
                            'bg-wwPrimary border-white/10 text-white/20'
                          }`}>
                             {step.status === 'completed' ? <FaCheckCircle className="text-xl" /> : <span className="text-xs font-bold">{idx + 1}</span>}
                          </div>
                          <span className={`text-[10px] font-bold text-center uppercase tracking-widest ${step.status === 'pending' ? 'text-white/20' : 'text-white'}`}>
                            {step.label}
                          </span>
                       </div>
                    ))}
                 </div>
              </div>

              {/* Advanced Mapping Interface */}
              <div className="ww-glass h-[400px] border-white/5 overflow-hidden relative group">
                 <div className="absolute inset-0 bg-wwCard/30 backdrop-blur-sm" />
                 
                 <div className="absolute inset-0 flex items-center justify-center z-10 p-12 text-center">
                    {location ? (
                       <div className="space-y-6">
                          <motion.div 
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-20 h-20 bg-wwGold/20 rounded-full flex items-center justify-center mx-auto border border-wwGold/30"
                          >
                             <FaMapMarkerAlt className="text-3xl text-wwGold" />
                          </motion.div>
                          <div>
                             <h4 className="text-2xl font-playfair font-bold text-white mb-2">Agent is maneuvering...</h4>
                             <p className="text-wwTextSecondary text-[10px] font-bold uppercase tracking-[0.2em] font-dm">LAT: {location.lat.toFixed(4)} | LNG: {location.lng.toFixed(4)}</p>
                          </div>
                       </div>
                    ) : (
                       <div className="space-y-6">
                          <div className="w-24 h-24 border border-dashed border-white/10 rounded-full flex items-center justify-center mx-auto opacity-30">
                             <FaCompass className="text-4xl text-white animate-spin" />
                          </div>
                          <div>
                             <h4 className="text-xl font-playfair font-bold text-white/30">Awaiting Signal Acquisition</h4>
                             <p className="text-wwTextSecondary text-[10px] font-bold uppercase tracking-widest">Ground team has not yet initiated execution phase</p>
                          </div>
                       </div>
                    )}
                 </div>

                 {/* Tactical Background Overlay */}
                 <div className="absolute inset-0 opacity-[0.05] pointer-events-none select-none overflow-hidden">
                    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#FFB830 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }} />
                    <div className="h-full w-[1px] bg-wwGold absolute left-1/2 top-0" />
                    <div className="w-full h-[1px] bg-wwGold absolute top-1/2 left-0" />
                 </div>
              </div>
           </div>

           {/* Right: Operational Details */}
           <div className="space-y-6">
              <div className="ww-glass p-8 border-white/5 space-y-6">
                 <h3 className="text-[10px] font-bold text-wwGold uppercase tracking-widest">Field operative</h3>
                 {booking.assignedAgent ? (
                    <div className="flex items-center gap-4">
                       <div className="w-14 h-14 bg-wwGold/10 border border-wwGold/30 rounded-full flex items-center justify-center text-xl font-bold text-wwGold">
                          {booking.assignedAgent.fullName.charAt(0)}
                       </div>
                       <div>
                          <p className="text-lg font-bold text-white">{booking.assignedAgent.fullName}</p>
                          <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Verified Specialist</p>
                       </div>
                    </div>
                 ) : (
                    <div className="flex items-center gap-3 animate-pulse opacity-50">
                       <div className="w-14 h-14 bg-white/5 rounded-full" />
                       <p className="text-[10px] text-wwTextSecondary font-bold uppercase tracking-widest">Recruiting operative...</p>
                    </div>
                 )}
              </div>

              <div className="ww-glass p-8 border-wwGold/20 bg-wwGold/5 space-y-6">
                 <div className="flex items-center gap-3 text-wwGold">
                    <FaHeadset className="text-lg" />
                    <h3 className="text-[10px] font-bold uppercase tracking-widest">Tactical Support</h3>
                 </div>
                 <p className="text-wwTextSecondary text-xs leading-relaxed font-dm">
                    Direct access to mission control 24/7. Monitoring every step of your surprise's journey.
                 </p>
                 <button className="w-full bg-wwGold text-wwPrimary py-3 text-[10px] font-bold uppercase tracking-widest hover:shadow-[0_0_20px_rgba(255,184,48,0.3)] transition-all">
                    Link with Operations
                 </button>
              </div>

              <div className="ww-glass p-8 border-white/5">
                 <div className="flex items-center gap-3 text-white/50 mb-4">
                    <FaClock className="text-sm" />
                    <h3 className="text-[10px] font-bold uppercase tracking-widest">Timing Log</h3>
                 </div>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-bold tracking-widest">
                       <span className="text-wwTextSecondary">EXPECTED</span>
                       <span className="text-white">{booking.eventTime}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold tracking-widest">
                       <span className="text-wwTextSecondary">COORDINATES</span>
                       <span className="text-white uppercase">{booking.recipientCity}</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
