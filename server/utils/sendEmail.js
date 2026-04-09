const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const sendBookingConfirmationEmail = async (email, booking) => {
  try {
    const transporter = createTransporter();
    let info = await transporter.sendMail({
      from: `"Wish Wings" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Wish Wings Surprise is Booked! 🎉",
      html: `
        <h2>Booking Received!</h2>
        <p>Thank you for booking with Wish Wings. We have received your request for a surprise on ${new Date(booking.eventDate).toDateString()} at ${booking.eventTime}.</p>
        <p>Your booking is currently awaiting agent assignment from our admin team. You will be notified once an agent is assigned.</p>
        <p>Warm Regards,<br>The Wish Wings Team</p>
      `,
    });
    console.log("Message sent: %s", info.messageId);
  } catch(error) {
    console.error("Email error: ", error);
  }
};

const sendOtpEmail = async (email, otp) => {
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"Wish Wings" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Password Reset OTP — Wish Wings 🔐",
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #1a1a2e; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,184,48,0.2);">
          <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #FFB830; font-size: 28px; margin: 0 0 8px 0; letter-spacing: 2px;">WISH WINGS</h1>
            <p style="color: #a0a0b8; font-size: 13px; margin: 0; letter-spacing: 1px;">PASSWORD RESET REQUEST</p>
          </div>
          <div style="padding: 40px 30px; text-align: center;">
            <p style="color: #e0e0e8; font-size: 15px; line-height: 1.6; margin: 0 0 30px 0;">
              We received a request to reset your password. Use the OTP below to proceed:
            </p>
            <div style="background: rgba(255,184,48,0.08); border: 2px dashed #FFB830; border-radius: 12px; padding: 24px; margin: 0 0 30px 0;">
              <span style="font-size: 40px; font-weight: 800; color: #FFB830; letter-spacing: 12px; font-family: 'Courier New', monospace;">${otp}</span>
            </div>
            <p style="color: #a0a0b8; font-size: 13px; margin: 0 0 8px 0;">
              ⏱️ This OTP is valid for <strong style="color: #FFB830;">10 minutes</strong>.
            </p>
            <p style="color: #a0a0b8; font-size: 12px; margin: 0;">
              If you didn't request this, please ignore this email.
            </p>
          </div>
          <div style="background: rgba(255,184,48,0.05); padding: 20px 30px; text-align: center; border-top: 1px solid rgba(255,184,48,0.1);">
            <p style="color: #666680; font-size: 11px; margin: 0;">© ${new Date().getFullYear()} Wish Wings. All rights reserved.</p>
          </div>
        </div>
      `,
    });
    console.log("OTP email sent to:", email);
  } catch (error) {
    console.error("OTP email error:", error);
    throw error;
  }
};

const sendWelcomeEmail = async (email, fullName) => {
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"Wish Wings" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to the Wish Wings Family! 🦋✨",
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #1a1a2e; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,184,48,0.2);">
          <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #FFB830; font-size: 28px; margin: 0 0 8px 0; letter-spacing: 2px;">WISH WINGS</h1>
            <p style="color: #a0a0b8; font-size: 13px; margin: 0; letter-spacing: 1px;">WELCOME ABOARD ✨</p>
          </div>
          <div style="padding: 40px 30px; text-align: center;">
            <h2 style="color: #FFB830; font-size: 22px; margin: 0 0 20px 0;">Hey ${fullName}! 🎉</h2>
            <p style="color: #e0e0e8; font-size: 15px; line-height: 1.8; margin: 0 0 24px 0;">
              You've successfully registered with <strong style="color: #FFB830;">Wish Wings</strong> — where surprises come to life!
            </p>
            <div style="background: rgba(255,184,48,0.08); border-radius: 12px; padding: 24px; margin: 0 0 24px 0; text-align: left;">
              <p style="color: #e0e0e8; font-size: 14px; margin: 0 0 12px 0;">🎁 <strong style="color: #FFB830;">Browse Surprise Packages</strong> — Explore our curated experiences</p>
              <p style="color: #e0e0e8; font-size: 14px; margin: 0 0 12px 0;">💝 <strong style="color: #FFB830;">Book a Surprise</strong> — Let us handle the magic</p>
              <p style="color: #e0e0e8; font-size: 14px; margin: 0;">🦋 <strong style="color: #FFB830;">Track Live</strong> — Watch the surprise unfold in real time</p>
            </div>
            <p style="color: #a0a0b8; font-size: 13px; line-height: 1.6; margin: 0;">
              Your journey of creating unforgettable moments starts now. Log in and start exploring!
            </p>
          </div>
          <div style="background: rgba(255,184,48,0.05); padding: 20px 30px; text-align: center; border-top: 1px solid rgba(255,184,48,0.1);">
            <p style="color: #666680; font-size: 11px; margin: 0;">© ${new Date().getFullYear()} Wish Wings. All rights reserved.</p>
          </div>
        </div>
      `,
    });
    console.log("Welcome email sent to:", email);
  } catch (error) {
    console.error("Welcome email error:", error);
  }
};

module.exports = { sendBookingConfirmationEmail, sendOtpEmail, sendWelcomeEmail };
