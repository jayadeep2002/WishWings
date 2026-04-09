const User = require('../models/User');
const Agent = require('../models/Agent');
const Admin = require('../models/Admin');
const Otp = require('../models/Otp');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendWelcomeEmail, sendOtpEmail } = require('../utils/sendEmail');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

exports.registerUser = async (req, res) => {
  try {
    const { fullName, email, password, phone, country } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ success: false, error: 'User already exists' });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({ fullName, email, password: hashedPassword, phone, country });

    // Send welcome email (non-blocking)
    sendWelcomeEmail(email, fullName).catch(err => console.error('Welcome email failed:', err));

    res.status(201).json({ success: true, token: generateToken(user._id, 'user'), user });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, error: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, error: 'Invalid credentials' });
    res.json({ success: true, token: generateToken(user._id, 'user'), user });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};

exports.registerAgent = async (req, res) => {
  try {
    const { fullName, email, password, phone, city, state, pincodesServed, bio, servicesOffered } = req.body;
    const agentExists = await Agent.findOne({ email });
    if (agentExists) return res.status(400).json({ success: false, error: 'Agent already exists' });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const pincodes = typeof pincodesServed === 'string' ? pincodesServed.split(',').map(p => p.trim()) : pincodesServed;
    const agent = await Agent.create({ fullName, email, password: hashedPassword, phone, city, state, pincodesServed: pincodes, bio, servicesOffered });

    // Send welcome email (non-blocking)
    sendWelcomeEmail(email, fullName).catch(err => console.error('Welcome email failed:', err));

    res.status(201).json({ success: true, message: 'Your application is under review. Admin will approve your profile before you can start working. You will receive an email once approved.' });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};

exports.loginAgent = async (req, res) => {
  try {
    const { email, password } = req.body;
    const agent = await Agent.findOne({ email });
    if (!agent) return res.status(400).json({ success: false, error: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, agent.password);
    if (!isMatch) return res.status(400).json({ success: false, error: 'Invalid credentials' });
    if (!agent.isApproved) return res.status(403).json({ success: false, error: 'Your account is pending admin approval. Please wait.' });
    res.json({ success: true, token: generateToken(agent._id, 'agent'), agent });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Hardcoded Fallback
    if (email === 'jaideepsaichaganti@gmail.com' && password === 'Jai@2002') {
      let admin = await Admin.findOne({ email });
      if (!admin) {
        // Create it so we have an ID for the token
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        admin = await Admin.create({ name: 'Super Admin', email, password: hashedPassword });
      }
      return res.json({ success: true, token: generateToken(admin._id, 'admin'), admin });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ success: false, error: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ success: false, error: 'Invalid credentials' });
    res.json({ success: true, token: generateToken(admin._id, 'admin'), admin });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};

// ─── Password Reset via Email OTP ─────────────────────────────────────────────

exports.forgotPassword = async (req, res) => {
  try {
    const { email, role } = req.body;

    if (!email || !role) {
      return res.status(400).json({ success: false, error: 'Email and role are required' });
    }

    // Find account
    let account;
    if (role === 'user') {
      account = await User.findOne({ email });
    } else if (role === 'agent') {
      account = await Agent.findOne({ email });
    } else {
      return res.status(400).json({ success: false, error: 'Invalid role' });
    }

    if (!account) {
      return res.status(404).json({ success: false, error: 'No account found with this email' });
    }

    // Delete any old OTPs for this email
    await Otp.deleteMany({ email });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP with 10-minute expiry
    await Otp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    });

    // Send OTP email
    await sendOtpEmail(email, otp);

    res.json({ success: true, message: 'OTP sent to your email address' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, error: 'Email and OTP are required' });
    }

    const otpRecord = await Otp.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
    }

    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ success: false, error: 'OTP has expired. Please request a new one.' });
    }

    res.json({ success: true, message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword, role } = req.body;

    if (!email || !otp || !newPassword || !role) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    // Re-verify OTP
    const otpRecord = await Otp.findOne({ email, otp });
    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password based on role
    if (role === 'user') {
      await User.findOneAndUpdate({ email }, { password: hashedPassword });
    } else if (role === 'agent') {
      await Agent.findOneAndUpdate({ email }, { password: hashedPassword });
    } else {
      return res.status(400).json({ success: false, error: 'Invalid role' });
    }

    // Delete all OTPs for this email
    await Otp.deleteMany({ email });

    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
