import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FaReceipt, FaCheckCircle, FaClock, FaTimesCircle, FaUndoAlt, FaCalendarAlt, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const STATUS_CONFIG = {
  paid: { color: 'green', icon: <FaCheckCircle />, label: 'Paid' },
  pending: { color: 'yellow', icon: <FaClock />, label: 'Pending' },
  refunded: { color: 'blue', icon: <FaUndoAlt />, label: 'Refunded' },
};

const BOOKING_STATUS_CONFIG = {
  pending: { color: 'yellow' },
  confirmed: { color: 'blue' },
  agent_assigned: { color: 'purple' },
  in_progress: { color: 'orange' },
  completed: { color: 'green' },
  cancelled: { color: 'red' },
};

export default function TransactionHistory() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = sessionStorage.getItem('wishwings_user_token');
        const res = await axios.get(`http://${window.location.hostname}:5000/api/bookings/my-bookings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(res.data.bookings);
      } catch (err) {
        toast.error('Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchBookings();
  }, [user]);

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.paymentStatus === filter);

  const totalSpent = bookings
    .filter(b => b.paymentStatus === 'paid')
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  if (loading) return (
    <div className="min-h-screen bg-wwPrimary flex flex-col justify-center items-center gap-4">
      <div className="w-12 h-12 border-4 border-wwGold border-t-transparent rounded-full animate-spin"></div>
      <p className="text-wwGold font-bold uppercase tracking-widest text-xs">Loading Transactions...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-wwPrimary pt-28 pb-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <button
            onClick={() => navigate('/user/dashboard')}
            className="flex items-center gap-2 text-wwTextSecondary hover:text-wwGold text-xs font-bold uppercase tracking-widest mb-6 transition-colors"
          >
            <FaArrowLeft className="text-[10px]" /> Back to Dashboard
          </button>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-playfair font-bold text-white flex items-center gap-3">
                <FaReceipt className="text-wwGold text-3xl" /> Transaction History
              </h1>
              <p className="text-wwTextSecondary text-sm font-dm mt-1">
                {bookings.length} total transactions • ₹{totalSpent.toLocaleString()} spent
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', value: bookings.length, color: 'wwGold', bg: 'wwGold' },
            { label: 'Paid', value: bookings.filter(b => b.paymentStatus === 'paid').length, color: 'green-400', bg: 'green-500' },
            { label: 'Pending', value: bookings.filter(b => b.paymentStatus === 'pending').length, color: 'yellow-400', bg: 'yellow-500' },
            { label: 'Refunded', value: bookings.filter(b => b.paymentStatus === 'refunded').length, color: 'blue-400', bg: 'blue-500' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="ww-glass p-5 border-white/5 text-center"
            >
              <p className={`text-3xl font-bold text-${stat.color}`}>{stat.value}</p>
              <p className="text-wwTextSecondary text-[10px] uppercase tracking-widest font-bold mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['all', 'paid', 'pending', 'refunded'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 text-[10px] font-bold uppercase tracking-widest rounded-full border transition-all whitespace-nowrap ${
                filter === f
                  ? 'bg-wwGold text-wwPrimary border-wwGold'
                  : 'border-white/10 text-wwTextSecondary hover:border-wwGold/30 hover:text-white'
              }`}
            >
              {f === 'all' ? 'All' : STATUS_CONFIG[f]?.label || f}
            </button>
          ))}
        </div>

        {/* Transactions List */}
        {filtered.length === 0 ? (
          <div className="ww-glass p-16 text-center border-white/5">
            <div className="text-5xl mb-4 opacity-30">💸</div>
            <h3 className="text-xl font-playfair font-bold text-white mb-2">No Transactions Found</h3>
            <p className="text-wwTextSecondary font-dm text-sm">
              {filter === 'all' ? "You haven't made any bookings yet." : `No ${filter} transactions.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((booking, index) => {
              const ps = STATUS_CONFIG[booking.paymentStatus] || STATUS_CONFIG.pending;
              const bsColor = BOOKING_STATUS_CONFIG[booking.bookingStatus]?.color || 'gray';

              return (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="ww-glass p-6 border-white/5 hover:border-wwGold/20 transition-all group"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    {/* Left: Booking Info */}
                    <div className="flex-grow space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h4 className="text-lg font-playfair font-bold text-white group-hover:text-wwGold transition-colors">
                          {booking.package?.name || 'Custom Surprise'}
                        </h4>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest bg-${bsColor}-500/10 text-${bsColor}-400 border border-${bsColor}-500/20`}>
                          {booking.bookingStatus?.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-wwTextSecondary font-dm">
                        <span className="flex items-center gap-1.5">
                          <FaCalendarAlt className="text-wwGold text-[10px]" />
                          {new Date(booking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <span>•</span>
                        <span>To: <span className="text-white font-bold">{booking.recipientName}</span></span>
                        <span>•</span>
                        <span className="text-[10px] uppercase tracking-wider font-mono text-white/30">
                          #{booking._id.slice(-8).toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Right: Amount & Status */}
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-widest text-wwTextSecondary font-bold mb-0.5">Amount</p>
                        <p className="text-xl font-bold text-white">₹{booking.totalAmount?.toLocaleString()}</p>
                      </div>
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest bg-${ps.color}-500/10 text-${ps.color}-400 border border-${ps.color}-500/20`}>
                        {ps.icon}
                        {ps.label}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
