import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserShield, FaRoute, FaCheckCircle, FaMoneyBillWave, FaStar, FaIdCard, FaMapMarkerAlt, FaPhoneAlt, FaSignOutAlt, FaCalendarAlt, FaCloudUploadAlt, FaTimes } from 'react-icons/fa';
import { getImageUrl } from '../../utils/getImageUrl';


export default function AgentDashboard() {
  const { agent, logout } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Completion Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = sessionStorage.getItem('wishwings_agent_token');
        const res = await axios.get(`http://${window.location.hostname}:5000/api/agent/jobs`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setJobs(res.data.jobs);
      } catch (err) {
        toast.error('Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };
    if (agent?.isApproved) fetchJobs();
    else setLoading(false);
  }, [agent]);

  const updateStatus = async (id, status) => {
    try {
      const token = sessionStorage.getItem('wishwings_agent_token');
      const res = await axios.put(`http://${window.location.hostname}:5000/api/agent/jobs/${id}/status`, { bookingStatus: status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(jobs.map(j => j._id === id ? res.data.job : j));
      if (status !== 'completed') {
        toast.success('Status updated!', { icon: '✨' });
      }
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.error('Maximum 5 photos allowed');
      return;
    }
    setSelectedFiles(files);
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleCompleteMission = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      toast.error('At least one photo is required');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    selectedFiles.forEach(file => formData.append('photos', file));
    formData.append('caption', caption);

    try {
      const token = sessionStorage.getItem('wishwings_agent_token');
      const res = await axios.post(`http://${window.location.hostname}:5000/api/agent/jobs/${selectedJob}/upload`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}` 
        }
      });

      setJobs(jobs.map(j => j._id === selectedJob ? { ...j, bookingStatus: 'completed' } : j));
      toast.success('Mission Accomplished! Memories uploaded.', { icon: '🎁' });
      setIsModalOpen(false);
      setSelectedJob(null);
      setSelectedFiles([]);
      setPreviewUrls([]);
      setCaption('');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-wwPrimary flex flex-col justify-center items-center gap-4">
      <div className="w-12 h-12 border-4 border-wwGold border-t-transparent rounded-full animate-spin"></div>
      <p className="text-wwGold font-bold uppercase tracking-widest text-xs">Accessing Agent Hub...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-wwPrimary pt-28 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-80 space-y-6"
          >
            {/* Agent Identity Card */}
            <div className="ww-glass p-8 border-white/5 text-center relative overflow-hidden">
               {/* Background Glow */}
               <div className="absolute top-0 right-0 w-20 h-20 bg-wwGold/10 blur-2xl rounded-full" />
               
               <div className="w-24 h-24 bg-wwCard/50 border border-wwGold/30 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 text-wwGold relative z-10 shadow-[0_0_20px_rgba(255,184,48,0.1)] overflow-hidden">
                 {agent?.profilePhoto ? (
                   <img src={getImageUrl(agent.profilePhoto)} alt="Profile" className="w-full h-full object-cover" />
                 ) : (
                   agent?.fullName?.[0] || 'A'
                 )}
               </div>

               
               <h2 className="text-xl font-playfair font-bold text-white mb-1">{agent?.fullName}</h2>
               <div className="flex items-center justify-center gap-2 mb-6">
                  {agent?.isApproved ? (
                    <span className="text-[10px] bg-green-500/10 text-green-500 border border-green-500/20 px-3 py-1 rounded-full font-bold uppercase tracking-widest">Verified Partner</span>
                  ) : (
                    <span className="text-[10px] bg-wwGold/10 text-wwGold border border-wwGold/20 px-3 py-1 rounded-full font-bold uppercase tracking-widest">Verification Pending</span>
                  )}
               </div>

               <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
                  <div className="space-y-1">
                     <p className="text-[10px] text-wwTextSecondary uppercase font-bold tracking-widest">Gigs Done</p>
                     <p className="text-white font-bold text-lg">{agent?.totalJobsCompleted || 0}</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[10px] text-wwTextSecondary uppercase font-bold tracking-widest">Rating</p>
                     <div className="flex items-center justify-center gap-1 text-wwGold font-bold text-lg">
                        <FaStar className="text-sm" />
                        {agent?.rating?.toFixed(1) || '0.0'}
                     </div>
                  </div>
               </div>

               <button 
                 onClick={logout}
                 className="mt-8 flex items-center justify-center gap-2 w-full py-2 text-wwCoral text-[10px] font-bold uppercase tracking-widest border border-wwCoral/20 hover:bg-wwCoral/5 transition-all"
               >
                 <FaSignOutAlt /> Terminate Session
               </button>
            </div>

            {/* Verification Detail Card */}
            {!agent?.isApproved && (
              <div className="ww-glass p-6 border-wwGold/20 bg-wwGold/5">
                 <div className="flex items-center gap-3 text-wwGold mb-3">
                    <FaIdCard className="text-lg" />
                    <h3 className="text-[10px] uppercase font-bold tracking-widest">Document Review</h3>
                 </div>
                 <p className="text-wwTextSecondary text-xs font-dm leading-relaxed">
                   Your identity proofs and service bio are currently being audited by the Head Office. This usually takes 24-48 hours.
                 </p>
              </div>
            )}
          </motion.div>

          {/* Main Workspace */}
          <div className="flex-grow space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h1 className="text-3xl font-playfair font-bold text-white mb-1">Mission Control</h1>
                <p className="text-wwTextSecondary text-xs font-dm uppercase tracking-[0.2em]">Live Job Stream</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="ww-glass px-4 py-2 border-white/5 flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                   <span className="text-[10px] text-white font-bold uppercase tracking-widest">System Online</span>
                </div>
              </div>
            </div>

            {!agent?.isApproved ? (
              <div className="ww-glass p-20 text-center border-wwGold/10 bg-wwGold/5">
                 <div className="w-20 h-20 bg-wwGold/10 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                   🗝️
                 </div>
                 <h3 className="text-3xl font-playfair font-bold text-white mb-4">Awaiting Platform Access</h3>
                 <p className="text-wwTextSecondary font-dm text-sm max-w-md mx-auto leading-relaxed">
                   Your profile is currently being verified. Once approved, you will be assigned to magical surprises in your service area.
                 </p>
                 <div className="mt-10 flex justify-center gap-8">
                    <div className="text-center">
                       <div className="text-wwGold font-bold">1/2</div>
                       <p className="text-[10px] text-wwTextSecondary uppercase tracking-widest">Docs Verified</p>
                    </div>
                    <div className="text-center">
                       <div className="text-wwTextSecondary font-bold">Pending</div>
                       <p className="text-[10px] text-wwTextSecondary uppercase tracking-widest">Admin Stamp</p>
                    </div>
                 </div>
              </div>
            ) : (
              <div className="space-y-6">
                {jobs.length === 0 ? (
                  <div className="ww-glass p-16 text-center border-white/5">
                     <p className="text-wwTextSecondary font-dm italic text-lg opacity-40">Scanning for new opportunities...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {jobs.map(job => (
                      <motion.div 
                        key={job._id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="ww-glass overflow-hidden border-white/5 group hover:border-wwGold/30 transition-all duration-500"
                      >
                         <div className="p-1 bg-gradient-to-r from-wwGold/50 via-wwGold/10 to-transparent" />
                         <div className="p-8">
                            <div className="flex flex-col lg:flex-row justify-between gap-8">
                               {/* Mission Core */}
                               <div className="flex-grow space-y-6">
                                  <div className="flex items-center gap-4">
                                     <div className="w-12 h-12 bg-wwGold/10 rounded-sm flex items-center justify-center text-wwGold flex-shrink-0">
                                        <FaRoute className="text-xl" />
                                     </div>
                                     <div>
                                        <h4 className="text-2xl font-playfair font-bold text-white group-hover:text-wwGold transition-colors">{job.package?.name || 'Surprise Delivery'}</h4>
                                        <p className="text-wwTextSecondary text-xs font-dm uppercase tracking-widest">Mission ID: WW-{job._id.substring(18, 24).toUpperCase()}</p>
                                     </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                     <div className="ww-glass bg-white/5 p-4 border-white/5 space-y-3">
                                        <div className="flex items-center gap-3 text-wwGold">
                                          <FaMapMarkerAlt className="text-xs" />
                                          <span className="text-[10px] font-bold uppercase tracking-widest">Target Location</span>
                                        </div>
                                        <div>
                                           <p className="text-white font-bold text-sm mb-1">{job.recipientName}</p>
                                           <p className="text-wwTextSecondary text-xs leading-relaxed">{job.recipientAddress}, {job.recipientCity} - {job.recipientPincode}</p>
                                        </div>
                                     </div>
                                     <div className="ww-glass bg-white/5 p-4 border-white/5 space-y-3">
                                        <div className="flex items-center gap-3 text-wwGold">
                                          <FaRoute className="text-xs" />
                                          <span className="text-[10px] font-bold uppercase tracking-widest">Execution window</span>
                                        </div>
                                        <div className="flex items-baseline gap-3">
                                           <p className="text-white font-bold text-lg">{new Date(job.eventDate).toLocaleDateString()}</p>
                                           <p className="text-wwGold font-bold text-2xl">{job.eventTime}</p>
                                        </div>
                                     </div>
                                  </div>

                                  {job.specialInstructions && (
                                     <div className="p-4 bg-wwCoral/5 border-l-2 border-wwCoral/50 text-wwCoral text-xs italic font-dm">
                                        " {job.specialInstructions} "
                                     </div>
                                  )}
                               </div>

                               {/* Mission Status & Actions */}
                               <div className="lg:w-64 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/10 pt-8 lg:pt-0 lg:pl-8">
                                  <div className="text-right hidden lg:block">
                                     <p className="text-[10px] text-wwTextSecondary uppercase font-bold tracking-widest mb-2">Current Status</p>
                                     <div className="text-wwGold font-bold uppercase tracking-[0.2em] text-sm">
                                        {job.bookingStatus.replace('_', ' ')}
                                     </div>
                                  </div>

                                  <div className="space-y-3">
                                     <a href={`tel:${job.recipientPhone}`} className="flex items-center justify-center gap-3 w-full py-3 border border-wwGold/20 text-wwGold text-[10px] font-bold uppercase tracking-widest hover:bg-wwGold hover:text-wwPrimary transition-all">
                                        <FaPhoneAlt /> Call Contact
                                     </a>
                                     
                                     {job.bookingStatus === 'agent_assigned' && (
                                       <button onClick={() => updateStatus(job._id, 'in_progress')} className="ww-button-gold w-full text-[10px] uppercase font-bold tracking-widest py-3 border-none">
                                          Begin Journey
                                       </button>
                                     )}
                                     {job.bookingStatus === 'in_progress' && (
                                       <button 
                                         onClick={() => {
                                           setSelectedJob(job._id);
                                           setIsModalOpen(true);
                                         }} 
                                         className="ww-button-gold w-full text-[10px] uppercase font-bold tracking-widest py-3 border-none !bg-green-600"
                                       >
                                          Mark Accomplished
                                       </button>
                                     )}
                                     {job.bookingStatus === 'completed' && (
                                       <div className="bg-green-500/10 border border-green-500/20 text-green-500 flex items-center justify-center gap-2 py-3 rounded-sm">
                                          <FaCheckCircle />
                                          <span className="text-[10px] font-bold uppercase tracking-widest">Mission Complete</span>
                                       </div>
                                     )}
                                  </div>
                               </div>
                            </div>
                         </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !uploading && setIsModalOpen(false)}
              className="absolute inset-0 bg-wwPrimary/90 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative ww-glass max-w-lg w-full p-8 border-wwGold/20"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-playfair font-bold text-white">Capture the Magic</h3>
                <button 
                  disabled={uploading}
                  onClick={() => setIsModalOpen(false)} 
                  className="text-wwTextSecondary hover:text-white transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleCompleteMission} className="space-y-6">
                <p className="text-wwTextSecondary text-sm font-dm mb-4">
                  Please upload photos of the successful surprise. These will be added to the customer's Memory Vault.
                </p>

                <div className="space-y-4">
                  <div className="relative group">
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      onChange={handlePhotoChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      disabled={uploading}
                    />
                    <div className="border-2 border-dashed border-white/10 group-hover:border-wwGold/30 rounded-sm p-8 text-center transition-all">
                      <FaCloudUploadAlt className="text-4xl text-wwGold/40 group-hover:text-wwGold mx-auto mb-2" />
                      <p className="text-xs font-bold text-wwTextSecondary uppercase tracking-widest">Select Photos (Max 5)</p>
                    </div>
                  </div>

                  {/* Previews */}
                  <div className="flex flex-wrap gap-2">
                    {previewUrls.map((url, i) => (
                      <div key={i} className="relative w-16 h-16 rounded-sm overflow-hidden border border-white/10">
                        <img src={url} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-wwGold tracking-widest">Memory Caption (Optional)</label>
                  <input 
                    type="text" 
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="e.g. A beautiful smile from the recipient!"
                    className="w-full bg-white/5 border border-white/10 rounded-sm py-3 px-4 text-white outline-none focus:border-wwGold text-sm"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={uploading || selectedFiles.length === 0}
                  className="ww-button-gold w-full py-4 uppercase tracking-[0.2em] font-bold disabled:opacity-50"
                >
                  {uploading ? 'Uploading Memories...' : 'Complete Mission & Upload'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
