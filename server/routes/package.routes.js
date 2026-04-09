const express = require('express');
const router = express.Router();
const { getAllPackages, getPackageById, createPackage, updatePackage, deletePackage } = require('../controllers/package.controller');
const { protect } = require('../middleware/auth.middleware');

router.route('/')
  .get(getAllPackages)
  .post(protect(['admin']), createPackage);

router.route('/:id')
  .get(getPackageById)
  .put(protect(['admin']), updatePackage)
  .delete(protect(['admin']), deletePackage);

module.exports = router;
