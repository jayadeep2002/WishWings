const Agent = require('../models/Agent');
const Booking = require('../models/Booking');
const ReactionVault = require('../models/ReactionVault');

exports.getProfile = async (req, res) => {
  try {
    const agent = await Agent.findById(req.user.id).select('-password');
    res.json({ success: true, agent });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};

exports.updateProfile = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      // If using local storage, prepend the base URL
      if (req.file.destination) {
        updateData.profilePhoto = `/uploads/${req.file.filename}`;
      } else {
        updateData.profilePhoto = req.file.path; // Cloudinary path
      }
    }
    const agent = await Agent.findByIdAndUpdate(req.user.id, updateData, { new: true }).select('-password');
    res.json({ success: true, agent });
  } catch (error) { 
    console.error('Update Agent Profile Error:', error);
    res.status(500).json({ success: false, error: error.message }); 
  }
};


exports.getAssignedJobs = async (req, res) => {
  try {
    const jobs = await Booking.find({ assignedAgent: req.user.id }).populate('user package').sort('eventDate');
    res.json({ success: true, jobs });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await Booking.findOne({ _id: req.params.id, assignedAgent: req.user.id }).populate('user package');
    if (!job) return res.status(404).json({ success: false, error: 'Job not found' });
    res.json({ success: true, job });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};

exports.updateJobStatus = async (req, res) => {
  try {
    const { bookingStatus } = req.body;
    const job = await Booking.findOneAndUpdate({ _id: req.params.id, assignedAgent: req.user.id }, { bookingStatus }, { new: true });
    if (!job) return res.status(404).json({ success: false, error: 'Job not found' });
    res.json({ success: true, job });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};

exports.updateLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const job = await Booking.findOneAndUpdate({ _id: req.params.id, assignedAgent: req.user.id }, { agentLiveLocation: { lat, lng } }, { new: true });
    res.json({ success: true, job });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};


exports.uploadReaction = async (req, res) => {
  console.log('[DEBUG] Hit uploadReaction endpoint for booking:', req.params.id);
  try {
    if (!req.body) {
      console.error('[ERROR] req.body is undefined in uploadReaction');
      return res.status(400).json({ success: false, error: 'Request body is missing' });
    }
    const { caption } = req.body;
    const job = await Booking.findOne({ _id: req.params.id, assignedAgent: req.user.id });
    if (!job) return res.status(404).json({ success: false, error: 'Job not found' });

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, error: 'At least one photo is required to complete the mission' });
    }

    const mediaEntries = [];
    const photoUrls = [];

    for (const file of req.files) {
      let mediaUrl;
      // If using local storage, use the filename with /uploads/ prefix
      // If using Cloudinary, use file.path
      if (file.destination) {
        mediaUrl = `/uploads/${file.filename}`;
      } else {
        mediaUrl = file.path;
      }
      
      photoUrls.push(mediaUrl);

      const entry = await ReactionVault.create({
        booking: job._id,
        agent: req.user.id,
        user: job.user,
        mediaType: 'photo',
        mediaUrl,
        caption: caption || 'Surprise Delivered!'
      });
      mediaEntries.push(entry);
    }

    // Update Booking status and photos
    job.bookingStatus = 'completed';
    job.reactionPhotos = [...(job.reactionPhotos || []), ...photoUrls];
    await job.save();

    res.status(201).json({ 
      success: true, 
      message: 'Mission accomplished! Photos uploaded and user notified.',
      vaultEntries: mediaEntries 
    });
  } catch (error) { 
    console.error('Upload Reaction Error:', error);
    res.status(500).json({ success: false, error: error.message }); 
  }
};
