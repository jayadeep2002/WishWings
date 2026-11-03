import { motion } from 'framer-motion';
import { FaLinkedin, FaGithub, FaTwitter, FaInstagram, FaPhone, FaEnvelope } from 'react-icons/fa';

export default function Contact() {
  const socialLinks = [
    { icon: <FaLinkedin />, url: "https://www.linkedin.com/in/jayadeepsai-chaganti-3a5b61237/", color: "#0077B5", label: "LinkedIn" },
    { icon: <FaGithub />, url: "https://github.com/jayadeep2002", color: "#FFFFFF", label: "GitHub" },
    { icon: <FaTwitter />, url: "https://x.com/jaideepsai_c", color: "#1DA1F2", label: "Twitter" },
    { icon: <FaInstagram />, url: "https://www.instagram.com/j_a_y_d_e_e_p__chaganti/", color: "linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)", label: "Instagram" },
  ];

  return (
    <div className="min-h-screen bg-wwPrimary pt-20 relative overflow-hidden flex items-center justify-center">
      {/* Background Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div 
            key={i}
            className="absolute bg-wwGold/20 rounded-full animate-float"
            style={{
              width: Math.random() * 6 + 2 + 'px',
              height: Math.random() * 6 + 2 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDelay: i * 0.3 + 's'
            }}
          />
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-full max-w-6xl mx-auto flex flex-col md:flex-row ww-glass overflow-hidden m-4 md:m-8 relative z-10"
      >
        {/* Left: Owner Photo */}
        <div className="md:w-[40%] relative aspect-square md:aspect-auto">
          <img 
            src="/contact-photo.jpg" 
            alt="Founder" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-wwGold/80 via-transparent to-transparent flex flex-col justify-end p-8 text-wwPrimary">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-3xl font-playfair font-bold">Jayadeepsai Chaganti</h2>
              <p className="text-sm font-dm font-bold uppercase tracking-widest mt-1">Founder, Wish Wings</p>
            </motion.div>
          </div>
        </div>

        {/* Right: Details */}
        <div className="md:w-[60%] p-10 md:p-16 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-4xl md:text-5xl font-playfair text-white font-bold mb-6">Get in Touch</h1>
            <p className="text-wwTextSecondary font-dm text-lg mb-10 leading-relaxed">
              Have a special request or want to partner with us? Reach out directly. I'm always happy to hear how we can help you bridge the distance.
            </p>

            <div className="space-y-6 mb-12">
              <div className="flex items-center gap-6 group">
                <div className="w-12 h-12 rounded-full border border-wwGold/20 flex items-center justify-center text-wwGold group-hover:bg-wwGold group-hover:text-wwPrimary transition-all duration-300 shadow-[0_0_15px_rgba(255,184,48,0.1)]">
                  <FaPhone className="text-xl" />
                </div>
                <div>
                   <p className="text-[10px] uppercase tracking-widest text-wwTextSecondary font-bold">Speak with me</p>
                   <p className="text-xl font-dm text-white">+91 91602 86679</p>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="w-12 h-12 rounded-full border border-wwGold/20 flex items-center justify-center text-wwGold group-hover:bg-wwGold group-hover:text-wwPrimary transition-all duration-300 shadow-[0_0_15px_rgba(255,184,48,0.1)]">
                  <FaEnvelope className="text-xl" />
                </div>
                <div>
                   <p className="text-[10px] uppercase tracking-widest text-wwTextSecondary font-bold">Email directly</p>
                   <p className="text-xl font-dm text-white">jaideepsaichaganti@gmail.com</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-6">
              {socialLinks.map((social, idx) => (
                <motion.a
                  key={idx}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, filter: 'drop-shadow(0 0 10px rgba(255,184,48,0.5))' }}
                  className="text-[44px] transition-all duration-300 flex items-center justify-center"
                  style={{ 
                    color: social.color.startsWith('linear') ? 'white' : social.color,
                    background: social.color.startsWith('linear') ? social.color : 'transparent',
                    WebkitBackgroundClip: social.color.startsWith('linear') ? 'text' : 'unset',
                    WebkitTextFillColor: social.color.startsWith('linear') ? 'transparent' : 'unset',
                    borderRadius: '8px'
                  }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>

            <p className="mt-16 font-dancing text-2xl text-wwGold text-center md:text-left">
              "Built with ❤️ to connect hearts across distances."
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
