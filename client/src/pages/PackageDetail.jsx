import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingCart, FaBolt, FaStar, FaChevronRight, FaLock, FaMapMarkerAlt, FaCalendarAlt, FaHistory, FaUserCircle } from 'react-icons/fa';
import { getImageUrl } from '../utils/getImageUrl';

export default function PackageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Reviews
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [completedBookings, setCompletedBookings] = useState([]);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  
  const [step, setStep] = useState(1);
  const occasionFromUrl = new URLSearchParams(location.search).get('occasion') || '';
  const [formData, setFormData] = useState({
    recipientName: '', recipientPhone: '', recipientAddress: '', recipientCity: '', recipientState: '', recipientPincode: '', 
    occasion: occasionFromUrl, eventDate: '', eventTime: '', specialInstructions: ''
  });
  const [customAmount, setCustomAmount] = useState('');

  useEffect(() => {
    const fetchPkg = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/packages/${id}`);
        setPkg(res.data.package);
      } catch (err) { toast.error('Failed to load package'); } finally { setLoading(false); }
    };
    fetchPkg();
    fetchReviews();
  }, [id]);

  // Auto-scroll to booking area when coming from occasion selection
  useEffect(() => {
    const autoScroll = new URLSearchParams(location.search).get('autoScroll');
    if (autoScroll && !loading) {
      setTimeout(() => {
        document.getElementById('booking-area')?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }, [loading, location.search]);

  // Fetch completed bookings for this package (to enable review form)
  useEffect(() => {
    const fetchCompletedBookings = async () => {
      if (!user) return;
      try {
        const token = sessionStorage.getItem('wishwings_user_token');
        const res = await axios.get('http://localhost:5000/api/bookings/my-bookings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const completed = res.data.bookings.filter(
          b => b.package?._id === id && b.bookingStatus === 'completed'
        );
        setCompletedBookings(completed);
        if (completed.length > 0) setSelectedBookingForReview(completed[0]._id);
      } catch { /* silent */ }
    };
    fetchCompletedBookings();
  }, [user, id]);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/reviews/package/${id}`);
      setReviews(res.data.reviews);
      setAvgRating(res.data.avgRating);
      setTotalReviews(res.data.totalReviews);
    } catch { /* silent */ }
  };

  const handleReviewSubmit = async () => {
    if (!selectedBookingForReview) return;
    setSubmittingReview(true);
    try {
      const token = localStorage.getItem('wishwings_user_token');
      await axios.post('http://localhost:5000/api/reviews', {
        bookingId: selectedBookingForReview,
        packageId: id,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Review submitted!', { icon: '⭐' });
      setReviewForm({ rating: 5, comment: '' });
      fetchReviews();
      // Remove that booking from the selectable list
      setCompletedBookings(prev => prev.filter(b => b._id !== selectedBookingForReview));
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleBooking = async (e) => {
    if (e) e.preventDefault();
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    
    try {
      const isCustom = pkg.category?.toLowerCase() === 'custom';
      const finalAmount = isCustom ? Number(customAmount) : pkg.price;
      if (isCustom && (!customAmount || finalAmount < (pkg.price || 0))) {
        toast.error(`Minimum budget is ₹${pkg.price || 500}`);
        return;
      }
      const token = localStorage.getItem('wishwings_user_token');
      await axios.post('http://localhost:5000/api/bookings', {
        ...formData, package: pkg._id, totalAmount: finalAmount
      }, { headers: { Authorization: `Bearer ${token}` } });
      
      toast.success('Your wish is our command! Booking confirmed.', { icon: '✨' });
      navigate('/user/dashboard');
    } catch (err) { toast.error(err.response?.data?.error || 'Booking failed'); }
  };

  const nextStep = () => {
    if (step === 1 && !user) {
      setShowLoginModal(true);
      return;
    }
    setStep(step + 1);
  };

  if (loading) return (
    <div className="min-h-screen bg-wwPrimary flex flex-col justify-center items-center gap-4">
      <div className="w-12 h-12 border-4 border-wwGold border-t-transparent rounded-full animate-spin"></div>
      <p className="text-wwGold font-bold uppercase tracking-widest text-xs">Summoning Details...</p>
    </div>
  );
  
  if (!pkg) return <div className="min-h-screen bg-wwPrimary flex justify-center items-center text-white">Package disappeared into the clouds.</div>;

  const imageUrl = pkg.image || "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=800&q=80";

  return (
    <div className="min-h-screen bg-wwPrimary pt-28 pb-20 px-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* Left: Media Area */}
        <div className="lg:w-1/2">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="ww-glass p-4 sticky top-28 border-white/5"
          >
            <div className="relative aspect-square rounded-sm overflow-hidden bg-wwCard/30 group">
               <img src={imageUrl} alt={pkg.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
               <div className="absolute top-4 left-4 bg-wwGold text-wwPrimary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                 {pkg.category}
               </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <button className="flex items-center justify-center gap-2 py-4 border border-white/20 text-white font-bold uppercase tracking-widest text-xs hover:bg-white/5 transition-all">
                <FaShoppingCart /> Save to Cart
              </button>
              <button 
                onClick={() => document.getElementById('booking-area').scrollIntoView({ behavior: 'smooth' })}
                className="ww-button-gold flex items-center justify-center gap-2 py-4 uppercase tracking-widest text-xs"
              >
                <FaBolt /> Buy Now
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right: Info Area */}
        <div className="lg:w-1/2 space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h1 className="text-4xl md:text-5xl font-playfair font-bold text-white leading-tight">{pkg.name}</h1>
              <div className="flex items-center gap-2 text-wwGold bg-wwGold/10 px-3 py-1 rounded-sm border border-wwGold/20">
                <span className="font-bold">{avgRating > 0 ? avgRating : '—'}</span>
                <FaStar className="text-xs" />
                {totalReviews > 0 && <span className="text-[10px] text-wwTextSecondary">({totalReviews})</span>}
              </div>
            </div>

            <p className="text-wwTextSecondary font-dm text-lg leading-relaxed">
              {pkg.description || "Transform ordinary days into extraordinary memories. This package includes everything needed to make your loved one feel truly special, no matter where you are."}
            </p>

            <div className="flex items-center gap-4 py-4 border-y border-white/5">
               <div className="flex-1">
                 <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-wwTextSecondary mb-1">
                   {pkg.category?.toLowerCase() === 'custom' ? 'Starting From' : 'Price'}
                 </p>
                 {pkg.category?.toLowerCase() === 'custom' ? (
                   <div className="space-y-3">
                     <div className="flex items-baseline gap-2">
                       <span className="text-2xl font-bold text-wwTextSecondary">₹{pkg.price}</span>
                       <span className="text-[10px] text-wwTextSecondary uppercase tracking-widest">minimum</span>
                     </div>
                     <div className="relative">
                       <span className="absolute left-4 top-1/2 -translate-y-1/2 text-wwGold font-bold text-lg">₹</span>
                       <input
                         type="number"
                         min={pkg.price}
                         value={customAmount}
                         onChange={(e) => setCustomAmount(e.target.value)}
                         placeholder={`Enter your budget (min ₹${pkg.price})`}
                         className="w-full bg-white/5 border border-wwGold/30 rounded-sm py-3 pl-10 pr-4 text-white text-lg font-bold outline-none focus:border-wwGold focus:ring-1 focus:ring-wwGold/30 transition-all placeholder:text-white/20 placeholder:font-normal placeholder:text-sm"
                       />
                     </div>
                   </div>
                 ) : (
                   <div className="flex items-baseline gap-2">
                     <span className="text-4xl font-bold text-white">₹{pkg.price}</span>
                     <span className="text-lg text-wwTextSecondary line-through">₹{Math.floor(pkg.price * 1.3)}</span>
                   </div>
                 )}
               </div>
               <div className="flex-1 text-right">
                  <span className="text-wwGold font-dancing text-xl font-bold">Free live tracking included</span>
               </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-wwGold">What's Included:</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-3">
                {(pkg.includes || ['Decoration', 'Cake', 'Flowers', 'Live Video']).map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-wwTextSecondary text-sm">
                    <span className="text-wwGold">✦</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Booking Steps Area */}
          <div id="booking-area" className="pt-10 space-y-4">
            {/* Step 1: User Verification */}
            <div className={`ww-glass border-white/5 overflow-hidden transition-all duration-500 ${step === 1 ? 'ring-1 ring-wwGold/50' : 'opacity-60 grayscale'}`}>
              <div className="p-4 bg-white/5 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-4">
                  <span className="w-6 h-6 rounded-full border border-wwGold/30 flex items-center justify-center text-wwGold text-[10px] font-bold">01</span>
                  <h3 className="text-xs uppercase tracking-widest font-bold text-white">Guest Identification</h3>
                </div>
                {step > 1 && <span className="text-wwGold text-xs font-bold">✓ VERIFIED</span>}
              </div>
              {step === 1 && (
                <div className="p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
                   <div>
                     <p className="text-white font-bold mb-1">{user ? user.fullName : "New Customer"}</p>
                     <p className="text-wwTextSecondary text-xs">{user ? user.email : "Identification required for booking"}</p>
                   </div>
                   {user ? (
                     <button onClick={nextStep} className="ww-button-gold !px-10">Continue to Address</button>
                   ) : (
                     <button onClick={() => setShowLoginModal(true)} className="ww-button-gold !px-10">Identify Yourself</button>
                   )}
                </div>
              )}
            </div>

            {/* Step 2: Recipient Details */}
            <div className={`ww-glass border-white/5 overflow-hidden transition-all duration-500 ${step === 2 ? 'ring-1 ring-wwGold/50' : step < 2 ? 'opacity-30' : 'opacity-60 grayscale'}`}>
              <div className="p-4 bg-white/5 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-4">
                  <span className="w-6 h-6 rounded-full border border-wwGold/30 flex items-center justify-center text-wwGold text-[10px] font-bold">02</span>
                  <h3 className="text-xs uppercase tracking-widest font-bold text-white">Delivery Coordinates</h3>
                </div>
                {step > 2 && <span className="text-wwGold text-xs font-bold">✓ LOGGED</span>}
              </div>
              {step === 2 && (
                <div className="p-8 space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-wwGold">Recipient Name</label>
                        <input type="text" value={formData.recipientName} onChange={e => setFormData({...formData, recipientName: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-sm py-2 px-4 text-white outline-none focus:border-wwGold text-sm" placeholder="e.g. Mom" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-wwGold">Phone Number</label>
                        <input type="tel" value={formData.recipientPhone} onChange={e => setFormData({...formData, recipientPhone: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-sm py-2 px-4 text-white outline-none focus:border-wwGold text-sm" placeholder="+91 00000 00000" />
                      </div>
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-wwGold">Full Address</label>
                      <textarea rows="2" value={formData.recipientAddress} onChange={e => setFormData({...formData, recipientAddress: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-sm py-2 px-4 text-white outline-none focus:border-wwGold text-sm" placeholder="Street, Building, Landmark..."></textarea>
                   </div>
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-wwGold">City</label>
                        <input type="text" value={formData.recipientCity} onChange={e => setFormData({...formData, recipientCity: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-sm py-2 px-4 text-white outline-none focus:border-wwGold text-sm" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-wwGold">State</label>
                        <input type="text" value={formData.recipientState} onChange={e => setFormData({...formData, recipientState: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-sm py-2 px-4 text-white outline-none focus:border-wwGold text-sm" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-wwGold">Pincode</label>
                        <input type="text" value={formData.recipientPincode} onChange={e => setFormData({...formData, recipientPincode: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-sm py-2 px-4 text-white outline-none focus:border-wwGold text-sm" />
                      </div>
                   </div>
                   <button onClick={nextStep} className="ww-button-gold !px-12">Submit Coordinates</button>
                </div>
              )}
            </div>

            {/* Step 3: Event Details */}
            <div className={`ww-glass border-white/5 overflow-hidden transition-all duration-500 ${step === 3 ? 'ring-1 ring-wwGold/50' : 'opacity-30'}`}>
              <div className="p-4 bg-white/5 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-4">
                  <span className="w-6 h-6 rounded-full border border-wwGold/30 flex items-center justify-center text-wwGold text-[10px] font-bold">03</span>
                  <h3 className="text-xs uppercase tracking-widest font-bold text-white">Event Scheduling</h3>
                </div>
              </div>
              {step === 3 && (
                <form onSubmit={handleBooking} className="p-8 space-y-6">
                   <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-wwGold">Occasion</label>
                      <select value={formData.occasion} required onChange={e => setFormData({...formData, occasion: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-sm py-2 px-4 text-white outline-none focus:border-wwGold text-sm appearance-none cursor-pointer" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23D4A843' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center' }}>
                        <option value="" disabled className="bg-[#1a1f2e] text-white/50">Select an Occasion</option>
                        <option value="Birthday" className="bg-[#1a1f2e] text-white">🎂 Birthday</option>
                        <option value="Anniversary" className="bg-[#1a1f2e] text-white">💍 Anniversary</option>
                        <option value="Welcome Home" className="bg-[#1a1f2e] text-white">🏠 Welcome Home</option>
                        <option value="Baby Shower" className="bg-[#1a1f2e] text-white">👶 Baby Shower</option>
                        <option value="Graduation" className="bg-[#1a1f2e] text-white">🎓 Graduation</option>
                        <option value="Engagement" className="bg-[#1a1f2e] text-white">💑 Engagement</option>
                        <option value="Wedding" className="bg-[#1a1f2e] text-white">💒 Wedding</option>
                        <option value="Housewarming" className="bg-[#1a1f2e] text-white">🏡 Housewarming</option>
                        <option value="Retirement" className="bg-[#1a1f2e] text-white">🎉 Retirement</option>
                        <option value="Valentine's Day" className="bg-[#1a1f2e] text-white">❤️ Valentine's Day</option>
                        <option value="Mother's Day" className="bg-[#1a1f2e] text-white">👩 Mother's Day</option>
                        <option value="Father's Day" className="bg-[#1a1f2e] text-white">👨 Father's Day</option>
                        <option value="Farewell" className="bg-[#1a1f2e] text-white">👋 Farewell</option>
                        <option value="Promotion" className="bg-[#1a1f2e] text-white">🏆 Promotion</option>
                        <option value="Custom" className="bg-[#1a1f2e] text-white">🎨 Custom</option>
                      </select>
                   </div>
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-wwGold">Event Date</label>
                        <input type="date" value={formData.eventDate} required onChange={e => setFormData({...formData, eventDate: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-sm py-2 px-4 text-white outline-none focus:border-wwGold text-sm" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-wwGold">Event Time</label>
                        <input type="time" value={formData.eventTime} required onChange={e => setFormData({...formData, eventTime: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-sm py-2 px-4 text-white outline-none focus:border-wwGold text-sm" />
                      </div>
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-wwGold">Secret Instructions</label>
                      <textarea rows="3" value={formData.specialInstructions} onChange={e => setFormData({...formData, specialInstructions: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-sm py-2 px-4 text-white outline-none focus:border-wwGold text-sm" placeholder="Tell the agent something secret..."></textarea>
                   </div>
                   <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-white/10 gap-4">
                      <div className="text-center sm:text-left">
                        <p className="text-[10px] uppercase font-bold text-wwGold tracking-widest">Grand Total</p>
                        <p className="text-3xl font-bold text-white">₹{pkg.category?.toLowerCase() === 'custom' ? (customAmount || pkg.price) : pkg.price}</p>
                      </div>
                      <button type="submit" className="ww-button-gold !px-16 !py-4 uppercase tracking-[0.2em] font-bold">Confirm Booking</button>
                   </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-7xl mx-auto mt-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-8"
        >
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-playfair font-bold text-white">Reviews & Ratings</h2>
              <p className="text-wwTextSecondary text-sm font-dm mt-1">
                {totalReviews > 0 ? `${totalReviews} ${totalReviews === 1 ? 'review' : 'reviews'} • ${avgRating} average` : 'No reviews yet'}
              </p>
            </div>
            {avgRating > 0 && (
              <div className="flex items-center gap-3 bg-wwGold/10 px-5 py-3 border border-wwGold/20 rounded-sm">
                <span className="text-3xl font-bold text-wwGold">{avgRating}</span>
                <div className="flex flex-col">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(s => (
                      <FaStar key={s} className={`text-xs ${s <= Math.round(avgRating) ? 'text-wwGold' : 'text-white/10'}`} />
                    ))}
                  </div>
                  <span className="text-[10px] text-wwTextSecondary uppercase tracking-widest font-bold">{totalReviews} reviews</span>
                </div>
              </div>
            )}
          </div>

          {/* Review Submission (only for users with completed bookings) */}
          {user && completedBookings.length > 0 && (
            <div className="ww-glass p-8 border-white/5">
              <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-wwGold mb-6">Write a Review</h3>
              
              {/* Star Selector */}
              <div className="flex items-center gap-1 mb-6">
                <span className="text-[10px] uppercase tracking-widest text-wwTextSecondary font-bold mr-3">Rating:</span>
                {[1,2,3,4,5].map(s => (
                  <button
                    key={s}
                    onClick={() => setReviewForm(prev => ({ ...prev, rating: s }))}
                    className="transition-all hover:scale-125"
                  >
                    <FaStar className={`text-xl ${s <= reviewForm.rating ? 'text-wwGold' : 'text-white/10 hover:text-wwGold/30'}`} />
                  </button>
                ))}
                <span className="ml-3 text-sm text-wwGold font-bold">{reviewForm.rating}/5</span>
              </div>

              {/* Comment */}
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                rows={3}
                placeholder="Share your experience..."
                className="w-full bg-white/5 border border-white/10 rounded-sm py-3 px-4 text-white outline-none focus:border-wwGold text-sm font-dm mb-4 placeholder:text-white/20"
              />

              <div className="flex items-center justify-between">
                {completedBookings.length > 1 && (
                  <select
                    value={selectedBookingForReview}
                    onChange={e => setSelectedBookingForReview(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-sm py-2 px-3 text-white text-xs outline-none focus:border-wwGold"
                  >
                    {completedBookings.map(b => (
                      <option key={b._id} value={b._id}>Booking #{b._id.slice(-6).toUpperCase()}</option>
                    ))}
                  </select>
                )}
                <button
                  onClick={handleReviewSubmit}
                  disabled={submittingReview}
                  className="ww-button-gold !px-8 !py-2.5 text-[10px] tracking-widest ml-auto disabled:opacity-50"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </div>
          )}

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <div className="ww-glass p-12 text-center border-white/5">
              <div className="text-5xl mb-4 opacity-20">⭐</div>
              <h3 className="text-xl font-playfair font-bold text-white mb-2">No Reviews Yet</h3>
              <p className="text-wwTextSecondary font-dm text-sm">Be the first to share your experience with this package.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review, idx) => (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="ww-glass p-6 border-white/5"
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-10 h-10 bg-wwGold/10 border border-wwGold/20 rounded-full flex items-center justify-center text-wwGold shrink-0 overflow-hidden">
                      {review.user?.profilePhoto ? (
                        <img src={getImageUrl(review.user.profilePhoto)} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <FaUserCircle className="text-lg" />
                      )}
                    </div>

                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-bold text-white">{review.user?.fullName || 'Anonymous'}</h4>
                        <span className="text-[10px] text-wwTextSecondary">
                          {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex gap-0.5 mb-3">
                        {[1,2,3,4,5].map(s => (
                          <FaStar key={s} className={`text-[10px] ${s <= review.rating ? 'text-wwGold' : 'text-white/10'}`} />
                        ))}
                      </div>
                      {review.comment && (
                        <p className="text-wwTextSecondary text-sm font-dm leading-relaxed">{review.comment}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Login Requirement Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLoginModal(false)}
              className="absolute inset-0 bg-wwPrimary/90 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative ww-glass max-w-md w-full p-10 text-center border-wwGold/20"
            >
              <div className="w-20 h-20 bg-wwGold/10 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                🔒
              </div>
              <h2 className="text-3xl font-playfair font-bold text-white mb-4">Authentication Required</h2>
              <p className="text-wwTextSecondary font-dm mb-10 leading-relaxed">
                To create magic, we need to know who is behind it. Please sign in to continue with your booking.
              </p>
              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => navigate(`/user/login?redirect=${location.pathname}`)}
                  className="ww-button-gold py-4 uppercase tracking-widest text-xs font-bold"
                >
                  Sign In as User
                </button>
                <button 
                  onClick={() => navigate(`/user/signup?redirect=${location.pathname}`)}
                  className="py-4 text-wwGold font-bold uppercase tracking-widest text-xs border border-wwGold/20 hover:bg-wwGold hover:text-wwPrimary transition-all"
                >
                  Join the Wish Wings Family
                </button>
                <button 
                  onClick={() => setShowLoginModal(false)}
                  className="text-white/40 text-[10px] uppercase font-bold tracking-widest pt-4 hover:text-white transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
