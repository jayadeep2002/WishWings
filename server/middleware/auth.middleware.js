const jwt = require('jsonwebtoken');
const Agent = require('../models/Agent');

const protect = (roles) => async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    if (roles && !roles.includes(decoded.role)) {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }
    if (decoded.role === 'agent') {
      const agent = await Agent.findById(decoded.id);
      if (!agent || !agent.isApproved) {
        return res.status(403).json({ success: false, error: 'Agent account pending admin approval' });
      }
    }
    next();
  } catch {
    res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
};

module.exports = { protect };
