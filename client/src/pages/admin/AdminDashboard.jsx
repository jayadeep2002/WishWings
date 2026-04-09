import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChartBar, FaBoxes, FaShieldAlt, FaUsers, FaGift, FaUserSecret, FaCogs, FaSignOutAlt, FaExclamationTriangle, FaCheckCircle, FaCamera, FaCommentAlt, FaStar, FaRegStar } from 'react-icons/fa';
import { getImageUrl } from '../../utils/getImageUrl';


export default function AdminDashboard() {
  const { admin, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [agents, setAgents] = useState([]);
  const [users, setUsers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const token = sessionStorage.getItem('wishwings_admin_token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const [statsRes, bookingsRes, agentsRes, usersRes, feedbackRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/dashboard', { headers }),
        axios.get('http://localhost:5000/api/admin/bookings', { headers }),
        axios.get('http://localhost:5000/api/admin/agents', { headers }),
        axios.get('http://localhost:5000/api/admin/users', { headers }),
        axios.get('http://localhost:5000/api/feedback', { headers })
      ]);
      
      setStats(statsRes.data.stats);
      setBookings(bookingsRes.data.bookings);
      setAgents(agentsRes.data.agents);
      setUsers(usersRes.data.users);
      setFeedbacks(feedbackRes.data.feedbacks);
    } catch (err) {
      toast.error('Central Node Data Sync Failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (admin) fetchData();
  }, [admin]);

  const handleAgentApproval = async (id, isApproved) => {
    try {
      const token = sessionStorage.getItem('wishwings_admin_token');
      await axios.put(`http://localhost:5000/api/admin/agents/${id}/${isApproved ? 'approve' : 'reject'}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Partner ${isApproved ? 'authorized' : 'access revoked'}`, { icon: '🛡️' });
      fetchData();
    } catch (err) { toast.error('Action failed'); }
  };

  const handleAssignAgent = async (bookingId, agentId) => {
    try {
      const token = sessionStorage.getItem('wishwings_admin_token');
      await axios.put(`http://localhost:5000/api/admin/bookings/${bookingId}/assign`, { agentId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Agent assigned to mission');
      setAssignModalOpen(false);
      fetchData();
    } catch (err) { toast.error('Assignment failed'); }
  };

  if (loading) return (
    <div className="min-h-screen bg-wwPrimary flex flex-col justify-center items-center gap-4">
      <div className="w-12 h-12 border-4 border-wwGold border-t-transparent rounded-full animate-spin"></div>
      <p className="text-wwGold font-bold uppercase tracking-widest text-xs">Connecting to Matrix...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-wwPrimary pt-28 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* Navigation Pod */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-72 flex flex-col gap-6"
        >
          <div className="ww-glass border-white/5 overflow-hidden">
             <div className="bg-white/5 p-6 border-b border-white/5">
                <div className="w-12 h-12 bg-wwGold/10 border border-wwGold/30 rounded flex items-center justify-center text-wwGold text-2xl mb-4 overflow-hidden">
                   {admin?.profilePhoto ? (
                     <img src={getImageUrl(admin.profilePhoto)} alt="Admin" className="w-full h-full object-cover" />
                   ) : (
                     <FaUserSecret />
                   )}
                </div>
                <h2 className="text-xl font-playfair font-bold text-white">Ghost Admin</h2>
                <p className="text-[10px] text-wwTextSecondary font-bold uppercase tracking-widest mt-1 opacity-60">ID: {admin?.email.split('@')[0]}</p>
             </div>
             
             <nav className="flex flex-col py-4">
                {[
                  { id: 'dashboard', icon: <FaChartBar />, label: 'Overview' },
                  { id: 'bookings', icon: <FaBoxes />, label: 'Orders' },
                  { id: 'agents', icon: <FaShieldAlt />, label: 'Partners' },
                  { id: 'feedbacks', icon: <FaCommentAlt />, label: 'Feedbacks' },
                  { id: 'users', icon: <FaUsers />, label: 'Customers' },
                  { id: 'packages', icon: <FaGift />, label: 'Catalog' },
                  { id: 'profile', icon: <FaCogs />, label: 'Profile' }
                ].map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-4 px-6 py-4 text-left transition-all relative ${activeTab === tab.id ? 'text-wwGold bg-wwGold/5 border-r-2 border-wwGold' : 'text-wwTextSecondary hover:text-white hover:bg-white/5'}`}
                  >
                    <span className="text-sm">{tab.icon}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest">{tab.label}</span>
                  </button>
                ))}
             </nav>

             <div className="p-4 border-t border-white/5">
                <button onClick={logout} className="flex items-center justify-center gap-2 w-full py-2 text-wwCoral text-[10px] font-bold uppercase tracking-widest border border-wwCoral/20 hover:bg-wwCoral/5 transition-all">
                   <FaSignOutAlt /> Terminate
                </button>
             </div>
          </div>
        </motion.div>

        {/* Main Workspace Pod */}
        <div className="flex-grow space-y-8">
           <div className="flex justify-between items-center bg-wwCard/30 backdrop-blur-md border border-white/5 p-6 rounded-sm">
              <h1 className="text-2xl font-playfair font-bold text-white capitalize">{activeTab} Control</h1>
              <div className="flex items-center gap-4">
                 <div className="text-right hidden sm:block">
                    <p className="text-[10px] text-wwTextSecondary uppercase font-bold tracking-widest">Server Status</p>
                    <p className="text-green-500 text-[10px] font-bold uppercase tracking-widest">Healthy / Stable</p>
                 </div>
                 <div className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center text-white/40">
                    <FaCogs />
                 </div>
              </div>
           </div>

           <div className="space-y-8">
              {activeTab === 'dashboard' && (
                <div className="space-y-8">
                   {/* High Level Stats */}
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <StatBlock title="Gross Orders" value={stats?.totalBookings} />
                      <StatBlock title="Live Agents" value={stats?.activeAgents} />
                      <StatBlock title="User Base" value={stats?.registeredUsers} />
                      <StatBlock title="Total Revenue" value={`₹${stats?.totalRevenue?.toLocaleString()}`} highlight />
                   </div>

                   {/* Critical Alerts */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div 
                        whileHover={{ y: -5 }}
                        onClick={() => setActiveTab('bookings')}
                        className="ww-glass p-8 border-wwCoral/20 bg-wwCoral/5 cursor-pointer flex justify-between items-center group"
                      >
                         <div>
                            <div className="flex items-center gap-2 text-wwCoral mb-2">
                               <FaExclamationTriangle className="text-sm" />
                               <span className="text-[10px] font-bold uppercase tracking-widest">Priority Issue</span>
                            </div>
                            <h3 className="text-xl font-playfair font-bold text-white">Ghost Missions</h3>
                            <p className="text-wwTextSecondary text-xs">Unassigned orders require mapping</p>
                         </div>
                         <div className="text-4xl font-bold text-wwCoral group-hover:scale-110 transition-transform">
                            {stats?.unassignedBookingsCount || 0}
                         </div>
                      </motion.div>

                      <motion.div 
                        whileHover={{ y: -5 }}
                        onClick={() => setActiveTab('agents')}
                        className="ww-glass p-8 border-wwGold/20 bg-wwGold/5 cursor-pointer flex justify-between items-center group"
                      >
                         <div>
                            <div className="flex items-center gap-2 text-wwGold mb-2">
                               <FaShieldAlt className="text-sm" />
                               <span className="text-[10px] font-bold uppercase tracking-widest">Auth Required</span>
                            </div>
                            <h3 className="text-xl font-playfair font-bold text-white">Partner Queue</h3>
                            <p className="text-wwTextSecondary text-xs">Pending KYC verifications</p>
                         </div>
                         <div className="text-4xl font-bold text-wwGold group-hover:scale-110 transition-transform">
                            {stats?.pendingAgentsCount || 0}
                         </div>
                      </motion.div>
                   </div>
                </div>
              )}

              {activeTab === 'bookings' && (
                <div className="ww-glass border-white/5 overflow-x-auto">
                   <table className="w-full text-left font-dm">
                      <thead>
                         <tr className="bg-white/5 text-[10px] uppercase tracking-widest font-bold text-wwGold">
                            <th className="p-6">Mission / Client</th>
                            <th className="p-6">Location</th>
                            <th className="p-6">Revenue</th>
                            <th className="p-6">Status / Agent</th>
                            <th className="p-6 text-right">Ops</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                         {bookings.length === 0 ? (
                           <tr><td colSpan="5" className="p-12 text-center text-wwTextSecondary opacity-50">No operational data found.</td></tr>
                         ) : (
                           bookings.map(b => (
                            <tr key={b._id} className="hover:bg-white/5 transition-colors">
                               <td className="p-6">
                                  <p className="text-white font-bold mb-1">{b.package?.name || 'Custom Package'}</p>
                                  <p className="text-[10px] text-wwTextSecondary">{b.recipientName} • {new Date(b.eventDate).toLocaleDateString()}</p>
                               </td>
                               <td className="p-6 text-wwTextSecondary font-bold text-xs uppercase tracking-widest">{b.recipientCity}</td>
                               <td className="p-6 text-white font-bold">₹{b.totalAmount}</td>
                               <td className="p-6">
                                  <div className="flex flex-col gap-2">
                                     <span className={`text-[9px] w-fit px-2 py-0.5 rounded-full font-bold uppercase tracking-widest ${
                                       b.bookingStatus === 'pending' ? 'bg-wwCoral/10 text-wwCoral border border-wwCoral/20' : 
                                       b.bookingStatus === 'completed' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 
                                       'bg-wwGold/10 text-wwGold border border-wwGold/20'
                                     }`}>
                                       {b.bookingStatus.replace('_', ' ')}
                                     </span>
                                     <span className="text-[10px] text-wwTextSecondary font-bold">
                                        Agent: {b.assignedAgent ? b.assignedAgent.fullName : <span className="text-wwCoral">UNASSIGNED</span>}
                                     </span>
                                  </div>
                               </td>
                               <td className="p-6 text-right">
                                  {!b.assignedAgent && (
                                     <button 
                                       onClick={() => { setSelectedBooking(b); setAssignModalOpen(true); }}
                                       className="text-[10px] font-bold uppercase tracking-widest text-wwGold border border-wwGold/20 px-4 py-2 hover:bg-wwGold hover:text-wwPrimary transition-all"
                                     >
                                       Deploy Agent
                                     </button>
                                  )}
                               </td>
                            </tr>
                           ))
                         )}
                      </tbody>
                   </table>
                </div>
              )}

              {activeTab === 'agents' && (
                <div className="grid grid-cols-1 gap-6">
                   {agents.map(a => (
                     <motion.div 
                       key={a._id}
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       className="ww-glass p-8 border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 group hover:border-wwGold/30 transition-all"
                     >
                        <div className="flex-grow">
                           <div className="flex items-center gap-4 mb-2">
                              <h3 className="text-xl font-playfair font-bold text-white group-hover:text-wwGold transition-colors">{a.fullName}</h3>
                              {a.isApproved ? (
                                <span className="text-[10px] bg-green-500/10 text-green-500 border border-green-500/20 px-3 py-1 rounded-full font-bold uppercase tracking-widest">Verified</span>
                              ) : (
                                <span className="text-[10px] bg-wwGold/10 text-wwGold border border-wwGold/20 px-3 py-1 rounded-full font-bold uppercase tracking-widest">In Review</span>
                              )}
                           </div>
                           <p className="text-wwTextSecondary text-xs">{a.email} • {a.phone}</p>
                           <div className="mt-4 flex gap-6">
                              <div className="space-y-1">
                                 <p className="text-[10px] text-wwTextSecondary font-bold uppercase tracking-widest">HQ Hub</p>
                                 <p className="text-white text-xs font-bold uppercase">{a.city}</p>
                              </div>
                              <div className="space-y-1">
                                 <p className="text-[10px] text-wwTextSecondary font-bold uppercase tracking-widest">Capability</p>
                                 <p className="text-white text-xs">{a.servicesOffered?.join(', ')}</p>
                              </div>
                           </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                           {a.idProof ? (
                              <a href={a.idProof} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 border border-white/10 text-white text-[10px] font-bold px-6 py-3 uppercase tracking-widest hover:bg-white/5">
                                 Audit KYC
                              </a>
                           ) : (
                              <button onClick={() => toast.error('No ID Proof uploaded by partner')} className="flex items-center justify-center gap-2 border border-white/5 text-white/30 text-[10px] font-bold px-6 py-3 uppercase tracking-widest cursor-not-allowed">
                                 No KYC Doc
                              </button>
                           )}
                           {!a.isApproved ? (
                             <button onClick={() => handleAgentApproval(a._id, true)} className="ww-button-gold !px-8 !py-3 text-[10px] border-none uppercase tracking-widest">Grant Access</button>
                           ) : (
                             <button onClick={() => handleAgentApproval(a._id, false)} className="border border-wwCoral/40 text-wwCoral text-[10px] px-8 py-3 uppercase tracking-widest font-bold hover:bg-wwCoral/5">Revoke Access</button>
                           )}
                        </div>
                     </motion.div>
                   ))}
                </div>
              )}

              {activeTab === 'users' && (
                <div className="ww-glass border-white/5 overflow-x-auto">
                   <table className="w-full text-left font-dm">
                      <thead>
                         <tr className="bg-white/5 text-[10px] uppercase tracking-widest font-bold text-wwGold">
                            <th className="p-6">Customer / Email</th>
                            <th className="p-6">Phone</th>
                            <th className="p-6">Country</th>
                            <th className="p-6 text-right">Registered On</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                         {users.length === 0 ? (
                           <tr><td colSpan="4" className="p-12 text-center text-wwTextSecondary opacity-50">No customer records found.</td></tr>
                         ) : (
                           users.map(u => (
                             <tr key={u._id} className="hover:bg-white/5 transition-colors">
                                <td className="p-6">
                                   <p className="text-white font-bold mb-1">{u.fullName}</p>
                                   <p className="text-[10px] text-wwTextSecondary">{u.email}</p>
                                </td>
                                <td className="p-6 text-wwTextSecondary text-xs">{u.phone || 'N/A'}</td>
                                <td className="p-6 text-wwTextSecondary text-xs font-bold uppercase tracking-widest">{u.country || 'N/A'}</td>
                                <td className="p-6 text-right text-wwTextSecondary text-[10px]">{new Date(u.createdAt).toLocaleDateString()}</td>
                             </tr>
                           ))
                         )}
                      </tbody>
                   </table>
                </div>
              )}

               {activeTab === 'feedbacks' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
                   {feedbacks.length === 0 ? (
                     <div className="md:col-span-2 ww-glass p-20 text-center opacity-40">
                        <FaCommentAlt className="text-4xl mx-auto mb-4" />
                        <p className="font-dm uppercase tracking-widest text-xs">No feedback signals received.</p>
                     </div>
                   ) : (
                     feedbacks.map(f => (
                       <motion.div 
                         key={f._id}
                         initial={{ opacity: 0, scale: 0.95 }}
                         animate={{ opacity: 1, scale: 1 }}
                         className="ww-glass p-8 border-white/5 flex flex-col gap-6 group hover:border-wwGold/20 transition-all bg-white/2"
                       >
                          <div className="flex justify-between items-start">
                             <div>
                                <h3 className="text-white font-playfair font-bold text-xl">{f.name}</h3>
                                <p className="text-[10px] text-wwTextSecondary font-bold uppercase tracking-widest">{f.email}</p>
                             </div>
                             <div className="text-wwGold flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                   i < f.rating ? <FaStar key={i} className="text-xs" /> : <FaRegStar key={i} className="text-xs opacity-20" />
                                ))}
                             </div>
                          </div>

                          <div className="space-y-4">
                             <div className="flex items-center gap-3">
                                <span className={`text-[9px] px-3 py-1 rounded-full font-bold uppercase tracking-widest ${
                                  f.category === 'Service' ? 'bg-wwGold/10 text-wwGold border border-wwGold/20' :
                                  f.category === 'Experience' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                                  f.category === 'Platform' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                  'bg-white/10 text-white/50 border border-white/10'
                                }`}>
                                   {f.category}
                                </span>
                                <span className="text-[10px] text-wwTextSecondary opacity-40 font-dm">{new Date(f.createdAt).toLocaleString()}</span>
                             </div>
                             <p className="text-wwTextSecondary text-sm leading-relaxed italic font-dm">
                                "{f.message}"
                             </p>
                          </div>

                          {f.user && (
                            <div className="pt-4 border-t border-white/5 flex items-center gap-2">
                               <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                               <span className="text-[9px] text-wwTextSecondary font-bold uppercase tracking-widest">Verified User Submission</span>
                            </div>
                          )}
                       </motion.div>
                     ))
                   )}
                </div>
              )}

              {activeTab === 'packages' && (
                <div className="ww-glass p-28 text-center border-white/5 opacity-40">
                   <div className="text-4xl mb-6">🛠️</div>
                   <h2 className="text-2xl font-playfair font-bold text-white mb-2">Module Refinement</h2>
                   <p className="text-wwTextSecondary text-sm font-dm">The catalog control logic is undergoing architectural optimization.</p>
                </div>
              )}

              {activeTab === 'profile' && (
                <AdminProfileSection admin={admin} />
              )}
           </div>
        </div>
      </div>

      {/* Agent Deployment Modal */}
      <AnimatePresence>
        {assignModalOpen && selectedBooking && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setAssignModalOpen(false)} className="absolute inset-0 bg-wwPrimary/90 backdrop-blur-xl" />
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative ww-glass max-w-2xl w-full flex flex-col border-white/10 max-h-[85vh]">
                <div className="p-6 bg-white/5 border-b border-white/5 flex justify-between items-center">
                   <h3 className="text-xl font-playfair font-bold text-white">Partner Deployment Pod</h3>
                   <button onClick={() => setAssignModalOpen(false)} className="text-wwTextSecondary hover:text-white text-2xl">×</button>
                </div>

                <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">
                   <div className="p-6 ww-glass bg-white/5 border-white/5">
                      <p className="text-[10px] uppercase font-bold text-wwGold tracking-[0.2em] mb-2">Target Sector</p>
                      <h4 className="text-2xl font-bold text-white uppercase">{selectedBooking.recipientCity}</h4>
                   </div>

                   <div className="space-y-4">
                      <h4 className="text-[10px] uppercase font-bold text-wwTextSecondary tracking-widest">Available Local Partners</h4>
                      
                      {agents.filter((a) => {
                         if (!a.isApproved) return false;
                         const aCity = a.city?.toLowerCase().trim() || "";
                         const bCityFull = selectedBooking.recipientCity?.toLowerCase().trim() || "";
                         const bParts = bCityFull.split(',').map(p => p.trim());
                         
                         const directMatch = bParts.some(part => part.includes(aCity) || aCity.includes(part));
                         if (directMatch) return true;

                         const isRJY = (name) => name.includes('rjy') || name.includes('rajamahendravaram') || name.includes('rajahmundry');
                         if (isRJY(aCity) && bParts.some(part => isRJY(part))) return true;

                         return false;
                      }).length > 0 ? (
                        <div className="space-y-4">
                          {agents.filter((a) => {
                             if (!a.isApproved) return false;
                             const aCity = a.city?.toLowerCase().trim() || "";
                             const bCityFull = selectedBooking.recipientCity?.toLowerCase().trim() || "";
                             const bParts = bCityFull.split(',').map(p => p.trim());
                             
                             const directMatch = bParts.some(part => part.includes(aCity) || aCity.includes(part));
                             if (directMatch) return true;

                             const isRJY = (name) => name.includes('rjy') || name.includes('rajamahendravaram') || name.includes('rajahmundry');
                             if (isRJY(aCity) && bParts.some(part => isRJY(part))) return true;

                             return false;
                          }).map(agent => (
                            <div key={agent._id} className="ww-glass p-6 border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 hover:border-wwGold/30 transition-all bg-white/5">
                               <div>
                                  <h4 className="text-white font-bold">{agent.fullName}</h4>
                                  <div className="flex gap-4 text-[10px] mt-2 text-wwTextSecondary font-bold uppercase tracking-widest">
                                     <span className="text-wwGold flex items-center gap-1">★ {agent.rating?.toFixed(1) || '0.0'} Trust</span>
                                     <span className="flex items-center gap-1">💼 {agent.totalJobsCompleted} Successes</span>
                                  </div>
                               </div>
                               <button onClick={() => handleAssignAgent(selectedBooking._id, agent._id)} className="ww-button-gold !px-6 !py-2.5 text-[10px] font-bold border-none uppercase tracking-widest">Deploy Partner</button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 text-center border border-dashed border-wwCoral/30 rounded-sm">
                           <p className="text-wwCoral text-xs font-dm italic mb-4">No verified partners found in this sector.</p>
                           <div className="space-y-4">
                              <p className="text-wwTextSecondary text-[10px] uppercase font-bold tracking-widest">Global Force Pool</p>
                              {agents.filter(a => a.isApproved).slice(0, 5).map(agent => (
                                <div key={agent._id} className="ww-glass p-4 border-white/5 flex justify-between items-center bg-white/5">
                                   <div className="text-left">
                                      <h4 className="text-white text-sm font-bold">{agent.fullName}</h4>
                                      <p className="text-[9px] text-wwGold uppercase">{agent.city}</p>
                                   </div>
                                   <button onClick={() => handleAssignAgent(selectedBooking._id, agent._id)} className="ww-button-gold !px-4 !py-1.5 text-[9px] font-bold border-none uppercase tracking-widest">Deploy</button>
                                </div>
                              ))}
                           </div>
                        </div>
                      )}
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const AdminProfileSection = ({ admin }) => {
  const { loginAdmin } = useAuth();
  const [name, setName] = useState(admin?.name || '');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(getImageUrl(admin?.profilePhoto) || '');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = sessionStorage.getItem('wishwings_admin_token');
      const data = new FormData();
      data.append('name', name);
      if (profilePhoto) data.append('profilePhoto', profilePhoto);

      const res = await axios.put('http://localhost:5000/api/admin/profile', data, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.success) {
        loginAdmin(token, res.data.admin);
        toast.success('Admin Profile Updated');
      }
    } catch (err) {
      toast.error('Update Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ww-glass p-12 border-white/5">
       <form onSubmit={handleUpdate} className="max-w-xl space-y-8">
          <div className="flex items-center gap-8">
             <div className="relative group">
                <div className="w-24 h-24 bg-wwGold/10 border border-wwGold/30 rounded flex items-center justify-center text-4xl text-wwGold overflow-hidden">
                   {previewUrl ? <img src={previewUrl} alt="Admin" className="w-full h-full object-cover" /> : <FaUserSecret />}
                </div>
                <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute -bottom-2 -right-2 w-8 h-8 bg-wwGold text-wwPrimary rounded flex items-center justify-center text-xs shadow-lg hover:scale-110 transition-transform">
                   <FaCogs />
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
             </div>
             <div>
                <h3 className="text-xl font-playfair font-bold text-white">Identity Management</h3>
                <p className="text-wwTextSecondary text-[10px] font-bold uppercase tracking-widest mt-1">Authorized Ghost Node Control</p>
             </div>
          </div>

          <div className="space-y-4">
             <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-wwGold tracking-widest">Display Alias</label>
                <input 
                  type="text" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 p-4 text-white text-sm outline-none focus:border-wwGold transition-all font-dm"
                />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Protocol Email (Locked)</label>
                <input type="text" value={admin?.email} disabled className="w-full bg-white/5 border border-white/5 p-4 text-white/20 text-sm outline-none cursor-not-allowed" />
             </div>
          </div>

          <button disabled={loading} type="submit" className="ww-button-gold !px-12 !py-4 text-[10px] font-bold uppercase tracking-widest border-none">
             {loading ? 'Synchronizing...' : 'Apply Overrides'}
          </button>
       </form>
    </motion.div>
  );
};

const StatBlock = ({ title, value, highlight }) => (
  <div className={`ww-glass p-6 border-white/5 ${highlight ? 'bg-wwGold/5 ring-1 ring-wwGold/20' : ''}`}>
    <h3 className="text-wwTextSecondary text-[9px] uppercase font-bold tracking-[0.2em] mb-2">{title}</h3>
    <div className={`text-2xl font-bold ${highlight ? 'text-wwGold' : 'text-white'}`}>
      {value || 0}
    </div>
  </div>
);
