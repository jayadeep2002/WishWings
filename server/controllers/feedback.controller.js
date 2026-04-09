const Feedback = require('../models/Feedback');

exports.submitFeedback = async (req, res) => {
  try {
    const { name, email, rating, category, message, userId } = req.body;
    
    console.log(`[Feedback] Attempting submission from ${email} (${name})`);

    const userRef = userId && userId.trim() !== '' ? userId : null;
    if (!userRef) console.log(`[Feedback] Processing guest submission from ${email}`);
    else console.log(`[Feedback] Processing submission from verified user: ${userRef}`);

    const feedback = new Feedback({
      user: userRef,
      name,
      email,
      rating,
      category,
      message
    });

    await feedback.save();
    console.log(`[Feedback] Successfully saved feedback from ${email}`);
    res.status(201).json({ success: true, message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('[Feedback] Submission error:', error);
    res.status(500).json({ success: false, error: 'Failed to submit feedback' });
  }
};

exports.getAllFeedback = async (req, res) => {
  try {
    console.log('[Feedback] Admin fetching all feedback');
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, feedbacks });
  } catch (error) {
    console.error('[Feedback] Fetch error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch feedback' });
  }
};
