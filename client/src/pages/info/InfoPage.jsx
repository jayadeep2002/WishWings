import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaShieldAlt, FaBook, FaUserTie, FaRocket, FaHandsHelping, FaBalanceScale, FaCookieBite, FaUserShield } from 'react-icons/fa';

const contentMap = {
  about: {
    title: "About Wish Wings",
    icon: <FaRocket />,
    subtitle: "Reimagining Human Connection Through Presence-as-a-Service",
    content: (
      <div className="space-y-6">
        <p>Wish Wings is a pioneering platform dedicated to bridging the distance between loved ones. We believe that physical distance should never be a barrier to emotional presence.</p>
        <p>Our "Presence-as-a-Service" model allows you to dispatch professional agents to perform gestures, deliver surprises, or simply provide a physical presence when you cannot be there yourself.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
            <h4 className="text-wwGold font-bold mb-2">Our Mission</h4>
            <p className="text-sm opacity-80">To make the world feel smaller and more connected by providing a reliable, emotional bridge through human presence.</p>
          </div>
          <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
            <h4 className="text-wwGold font-bold mb-2">Our Vision</h4>
            <p className="text-sm opacity-80">To become the global standard for meaningful human gestures and decentralized emotional support.</p>
          </div>
        </div>
      </div>
    )
  },
  story: {
    title: "Our Story",
    icon: <FaBook />,
    subtitle: "From a Simple Idea to a Global Network",
    content: (
      <div className="space-y-6">
        <p>Wish Wings began with a simple observation: millions of people live far away from the people they care about most. Whether it's for work, study, or adventure, we are often absent for the moments that matter.</p>
        <p>Founded in 2024, our journey started with a single "Presence Agent" delivering a simple bouquet in a small town. Today, we are building a vast network of verified partners across the globe, each committed to our high standards of service and emotional intelligence.</p>
        <p>Every "Wish" we fulfill is a testament to the power of human connection. We're not just a delivery service; we're a presence service.</p>
      </div>
    )
  },
  careers: {
    title: "Join the Flock",
    icon: <FaUserTie />,
    subtitle: "Building the Future of Emotional Logistics",
    content: (
      <div className="space-y-6 text-center py-10">
        <p className="text-xl italic">"We are looking for dreamers, doers, and emotional architects."</p>
        <p>Currently, we are expanding our core team in Product, Engineering, and Partner Happiness.</p>
        <div className="mt-8">
          <button onClick={() => window.location.href = 'mailto:careers@wishwings.com'} className="ww-button-gold !px-8 !py-3">View Open Positions</button>
        </div>
      </div>
    )
  },
  terms: {
    title: "Terms of Service",
    icon: <FaBalanceScale />,
    subtitle: "Governing our digital and physical interactions",
    content: (
      <div className="space-y-4 font-dm text-sm opacity-90">
        <p className="font-bold text-base text-white">Last Updated: March 2024</p>
        <h4 className="text-wwGold font-bold mt-6 uppercase tracking-widest text-xs">1. Presence Services</h4>
        <p>Wish Wings provides a platform connecting Customers with independent Agents ("Local Partners"). We do not directly employ agents, but provide the infrastructure for secure, verified interaction.</p>
        <h4 className="text-wwGold font-bold mt-6 uppercase tracking-widest text-xs">2. User Conduct</h4>
        <p>Users must provide accurate information and may not use the service for illegal or unethical purposes. Any form of harassment towards agents will result in immediate termination.</p>
        <h4 className="text-wwGold font-bold mt-6 uppercase tracking-widest text-xs">3. Cancellation & Refunds</h4>
        <p>Cancellations made within 24 hours of the scheduled mission are subject to a partial fee. Refunds for service failure are handled on a case-by-case basis through our centralized dispute center.</p>
      </div>
    )
  },
  privacy: {
    title: "Privacy Policy",
    icon: <FaShieldAlt />,
    subtitle: "How we protect your data and memories",
    content: (
      <div className="space-y-4 font-dm text-sm opacity-90">
        <h4 className="text-wwGold font-bold mt-6 uppercase tracking-widest text-xs">Data Collection</h4>
        <p>We collect only the information necessary to fulfill your missions: recipient details, location data, and context for the emotional gesture.</p>
        <h4 className="text-wwGold font-bold mt-6 uppercase tracking-widest text-xs">The Memory Vault</h4>
        <p>Any media uploaded to the Memory Vault is encrypted and accessible only by you and our authorized quality assurance team during processing.</p>
      </div>
    )
  },
  cookies: {
    title: "Cookie Policy",
    icon: <FaCookieBite />,
    subtitle: "Understanding our digital footprint",
    content: (
      <div className="space-y-6">
        <p>We use cookies to enhance your experience, remember your preferences, and maintain session security. By using Wish Wings, you agree to our use of essential cookies.</p>
      </div>
    )
  },
  safety: {
    title: "Safety Guidelines",
    icon: <FaUserShield />,
    subtitle: "Ensuring a secure environment for everyone",
    content: (
      <div className="space-y-6">
        <p>Safety is our top priority. All our agents undergo mandatory KYC verification and emotional intelligence testing.</p>
        <p>We encourage users to review our safety protocols for both recipients and agents to ensure every mission is a positive experience.</p>
      </div>
    )
  },
  help: {
    title: "Help Center",
    icon: <FaHandsHelping />,
    subtitle: "How can we assist you today?",
    content: (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Booking Flow', 'Agent Verification', 'Refund Status'].map(topic => (
            <div key={topic} className="p-6 bg-white/5 border border-white/10 rounded-xl hover:border-wwGold/30 transition-all cursor-pointer">
              <p className="font-bold text-sm text-wwGold">{topic}</p>
              <p className="text-[10px] opacity-60">View Articles & FAQ</p>
            </div>
          ))}
        </div>
        <div className="text-center p-10 bg-wwGold/5 rounded-2xl border border-wwGold/10">
          <p className="text-sm font-bold mb-4">Still need help?</p>
          <Link to="/contact" className="ww-button-gold !px-6 !py-2 text-xs">Reach Our Support Team</Link>
        </div>
      </div>
    )
  }
};

export default function InfoPage() {
  const { type } = useParams();
  const page = contentMap[type] || contentMap.about;

  return (
    <div className="min-h-screen bg-wwPrimary pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link to="/" className="inline-flex items-center gap-2 text-wwTextSecondary hover:text-wwGold transition-colors text-xs uppercase tracking-widest font-bold mb-12">
          <FaChevronLeft /> Back to Home
        </Link>

        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-6 mb-4">
            <div className="w-16 h-16 bg-wwGold/10 rounded-2xl flex items-center justify-center text-3xl text-wwGold border border-wwGold/20 shadow-[0_0_30px_rgba(255,184,48,0.1)]">
              {page.icon}
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-2">{page.title}</h1>
              <p className="text-wwTextSecondary font-dancing text-xl text-wwGold/80 italic">{page.subtitle}</p>
            </div>
          </div>
          <div className="h-px w-full bg-gradient-to-r from-wwGold/40 via-transparent to-transparent mt-8" />
        </motion.div>

        {/* Content Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="ww-glass p-8 md:p-12 border-white/5 text-wwTextPrimary leading-relaxed font-dm relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-10 opacity-[0.02] text-9xl text-wwGold">
            {page.icon}
          </div>
          {page.content}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-wwTextSecondary text-xs uppercase tracking-[0.3em] font-bold mb-6">Experience the Magic</p>
          <div className="flex justify-center gap-6">
            <Link to="/packages" className="ww-button-gold !px-8 !py-3">Book a Mission</Link>
            <Link to="/contact" className="border border-white/10 px-8 py-3 text-white text-[10px] items-center flex uppercase tracking-widest font-bold hover:bg-white/5 transition-all">Support</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
