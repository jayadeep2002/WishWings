const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getAssignedJobs, getJobById, updateJobStatus, updateLocation, uploadReaction } = require('../controllers/agent.controller');
const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload');


router.use(protect(['agent']));

router.route('/profile')
  .get(getProfile)
  .put(upload.single('profilePhoto'), updateProfile);


router.route('/jobs')
  .get(getAssignedJobs);

router.route('/jobs/:id')
  .get(getJobById);

router.route('/jobs/:id/status')
  .put(updateJobStatus);

router.route('/jobs/:id/location')
  .post(updateLocation);

router.route('/jobs/:id/upload')
  .post(upload.array('photos', 5), uploadReaction);

module.exports = router;
