const Package = require('../models/Package');

exports.getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find({ isActive: true });
    res.json({ success: true, packages });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};

exports.getPackageById = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) return res.status(404).json({ success: false, error: 'Package not found' });
    res.json({ success: true, package: pkg });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};

exports.createPackage = async (req, res) => {
  try {
    const pkg = await Package.create(req.body);
    res.status(201).json({ success: true, package: pkg });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};

exports.updatePackage = async (req, res) => {
  try {
    const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!pkg) return res.status(404).json({ success: false, error: 'Package not found' });
    res.json({ success: true, package: pkg });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};

exports.deletePackage = async (req, res) => {
  try {
    await Package.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Package deleted' });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};
