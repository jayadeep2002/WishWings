const mongoose = require('mongoose');
const Package = require('./models/Package');
require('dotenv').config();

const occasionPackages = [
  // Birthday
  {
    name: 'Birthday Blast',
    description: 'A vibrant birthday celebration with colorful balloons, a delicious chocolate cake, and a personalized birthday banner.',
    price: 1499,
    category: 'birthday',
    includes: ['Colorful Balloons', 'Chocolate Cake', 'Birthday Banner', 'Party Hats'],
    duration: '2-3 hours'
  },
  {
    name: 'Grand Birthday Jubilee',
    description: 'Experience the ultimate birthday party with custom themes, a 2-tier designer cake, live photography, and a luxury gift package.',
    price: 4999,
    category: 'birthday',
    includes: ['Themed Decor', '2-Tier Designer Cake', 'Live Photography', 'Luxury Gift Set', 'Confetti Show'],
    duration: '4-5 hours'
  },

  // Anniversary
  {
    name: 'Forever Together',
    description: 'Celebrate your love with a romantic candlelight dinner setup, a bouquet of red roses, and a heart-shaped anniversary cake.',
    price: 2499,
    category: 'anniversary',
    includes: ['Candlelight Dinner Setup', 'Red Roses Bouquet', 'Heart Cake', 'Fairy Lights'],
    duration: '3-4 hours'
  },
  {
    name: 'Diamond Anniversary Celebration',
    description: 'A luxurious milestone celebration with premium floral arches, live violinist, a grand anniversary banquet, and professional cinematography.',
    price: 7999,
    category: 'anniversary',
    includes: ['Premium Floral Arch', 'Live Violinist', 'Grand Banquet', 'Cinematography', 'Personalized Love Story Video'],
    duration: '5-6 hours'
  },

  // Gifts
  {
    name: 'Curated Gift Box',
    description: 'A thoughtfully hand-picked gift box containing premium chocolates, a customized mug, and a preserved rose.',
    price: 999,
    category: 'gifts',
    includes: ['Premium Chocolates', 'Custom Mug', 'Preserved Rose', 'Handwritten Note'],
    duration: 'N/A'
  },
  {
    name: 'Grand Gift Hamper',
    description: 'An extravagant gift hamper filled with luxury treats, a personalized photo frame, and high-end grooming/lifestyle products.',
    price: 2999,
    category: 'gifts',
    includes: ['Luxury Treats', 'Photo Frame', 'Premium Grooming Kit', 'Exotic Tea Sampler'],
    duration: 'N/A'
  },

  // Surprise
  {
    name: 'Flash Surprise',
    description: 'A quick and exciting surprise visit by our team with a balloon release and a small gift to brighten anyone\'s day.',
    price: 799,
    category: 'surprise',
    includes: ['Balloon Release', 'Mini Gift', 'Surprise Visit'],
    duration: '30-45 mins'
  },
  {
    name: 'Midnight Magic Surprise',
    description: 'The ultimate midnight surprise at their doorstep with music, cake, and a dazzling LED decoration setup.',
    price: 3499,
    category: 'surprise',
    includes: ['Music Performance', 'Midnight Cake Delivery', 'LED Decorations', 'Confetti Cannon'],
    duration: '1-2 hours'
  },

  // Custom
  {
    name: 'Bespoke Experience',
    description: 'Work with our master planners to design a unique surprise that perfectly matches your vision and budget.',
    price: 5000,
    category: 'custom',
    includes: ['Planning Consultation', 'Custom Execution', 'Dedicated Manager'],
    duration: 'Flexible'
  },

  // Welcome Home
  {
    name: 'Welcome Home Basics',
    description: 'A warm homecoming surprise with beautiful decorations, a welcome banner, and fresh flowers to make your loved one feel special the moment they walk in.',
    price: 1299,
    category: 'welcome home',
    includes: ['Welcome Banner', 'Balloon Decoration', 'Fresh Flowers', 'Photo Setup'],
    duration: '2-3 hours'
  },
  {
    name: 'Welcome Home Deluxe',
    description: 'An unforgettable homecoming celebration with premium decorations, a customized cake, live video of the surprise, and a memory scrapbook.',
    price: 2999,
    category: 'welcome home',
    includes: ['Premium Decoration', 'Custom Cake', 'Live Video Call', 'Scrapbook', 'Balloon Arch', 'Welcome Banner'],
    duration: '3-4 hours'
  },

  // Baby Shower (adding more if not enough exist)
  {
    name: 'Baby Shower Bliss',
    description: 'Celebrate the arrival of a new little one with pastel decorations, teddy bear arrangements, a themed cake, and adorable photo props.',
    price: 2499,
    category: 'baby shower',
    includes: ['Pastel Balloon Decor', 'Themed Cake', 'Teddy Bear Setup', 'Photo Props', 'Gift Hamper'],
    duration: '3-4 hours'
  },
  {
    name: 'Baby Shower Grand',
    description: 'A premium baby shower experience with stunning decorations, a customized 2-tier cake, gender reveal setup, live streaming, and keepsake gifts.',
    price: 4999,
    category: 'baby shower',
    includes: ['Grand Decoration', '2-Tier Custom Cake', 'Gender Reveal Setup', 'Live Streaming', 'Keepsake Album', 'Gift Hamper'],
    duration: '4-5 hours'
  },

  // Graduation
  {
    name: 'Graduation Celebration',
    description: 'Honor their academic achievement with cap & gown themed decorations, a congratulations cake, and a personalized certificate frame.',
    price: 1799,
    category: 'graduation',
    includes: ['Themed Decoration', 'Congratulations Cake', 'Certificate Frame', 'Balloon Bouquet', 'Photo Props'],
    duration: '2-3 hours'
  },
  {
    name: 'Graduation Grand Party',
    description: 'A spectacular graduation celebration with premium decorations, a customized cake, memory video montage, live streaming, and a gift hamper.',
    price: 3999,
    category: 'graduation',
    includes: ['Premium Decoration', 'Custom Cake', 'Video Montage', 'Live Streaming', 'Gift Hamper', 'Confetti Cannon'],
    duration: '4-5 hours'
  },

  // Engagement
  {
    name: 'Engagement Essentials',
    description: 'Set the stage for a beautiful proposal with romantic décor, a ring presentation setup, rose petals, and a heartfelt surprise arrangement.',
    price: 2999,
    category: 'engagement',
    includes: ['Ring Presentation Setup', 'Rose Petal Decoration', 'Candle Arrangement', 'Balloon Décor', 'Photography'],
    duration: '3-4 hours'
  },
  {
    name: 'Engagement Premium',
    description: 'A dreamy and luxurious engagement setup with grand floral arrangements, fairy lights, a premium cake, live music, and professional photography.',
    price: 6999,
    category: 'engagement',
    includes: ['Grand Floral Setup', 'Fairy Lights Canopy', 'Premium Cake', 'Live Music', 'Professional Photography', 'Champagne Setup'],
    duration: '5-6 hours'
  },

  // Wedding
  {
    name: 'Wedding Surprise Package',
    description: 'Surprise the newlyweds with a beautifully decorated room, fresh flowers, a wedding cake, and a romantic candlelight setup.',
    price: 3499,
    category: 'wedding',
    includes: ['Room Decoration', 'Wedding Cake', 'Fresh Flowers', 'Candle Setup', 'Gift Wrapping'],
    duration: '3-4 hours'
  },
  {
    name: 'Wedding Royal Package',
    description: 'A royal wedding surprise with lavish decorations, a 3-tier cake, floral archway, live band performance, fireworks, and luxury gift hamper.',
    price: 9999,
    category: 'wedding',
    includes: ['Lavish Decoration', '3-Tier Cake', 'Floral Archway', 'Live Band', 'Fireworks', 'Luxury Gift Hamper'],
    duration: '6-8 hours'
  },

  // Housewarming
  {
    name: 'Housewarming Welcome',
    description: 'Bless the new home with traditional décor, a welcome plant, housewarming cake, and a beautifully arranged entrance setup.',
    price: 1599,
    category: 'housewarming',
    includes: ['Traditional Décor', 'Welcome Plant', 'Housewarming Cake', 'Entrance Setup', 'Rangoli'],
    duration: '2-3 hours'
  },
  {
    name: 'Housewarming Grand',
    description: 'A grand housewarming celebration with premium decorations, a custom cake, pooja setup, live streaming for distant family, and a gift hamper.',
    price: 3499,
    category: 'housewarming',
    includes: ['Premium Decoration', 'Custom Cake', 'Pooja Setup', 'Live Streaming', 'Gift Hamper', 'Fresh Flowers'],
    duration: '4-5 hours'
  },

  // Retirement
  {
    name: 'Retirement Honor',
    description: 'Celebrate years of hard work with a dignified farewell setup, a memory wall, appreciation cake, and a heartfelt thank-you video montage.',
    price: 2499,
    category: 'retirement',
    includes: ['Farewell Decoration', 'Memory Wall', 'Appreciation Cake', 'Thank-You Video', 'Gift Plaque'],
    duration: '3-4 hours'
  },
  {
    name: 'Retirement Grand Salute',
    description: 'A grand retirement celebration with premium decorations, a customized cake, video montage of career highlights, live event coordination.',
    price: 4999,
    category: 'retirement',
    includes: ['Grand Decoration', 'Custom Cake', 'Career Video Montage', 'Live Coordination', 'Award Trophy', 'Photo Booth'],
    duration: '5-6 hours'
  },

  // Valentine's Day
  {
    name: "Valentine's Day Romance",
    description: "Express your love with a romantic surprise — red roses, heart-shaped balloons, a love letter setup, chocolate box, and a candlelight arrangement.",
    price: 1999,
    category: "valentine's day",
    includes: ['Red Roses Bouquet', 'Heart Balloons', 'Love Letter Setup', 'Chocolate Box', 'Candle Arrangement'],
    duration: '2-3 hours'
  },
  {
    name: "Valentine's Day Premium",
    description: "A luxury Valentine's celebration with 100 roses, a rooftop-style candlelight dinner setup, premium cake, personalized gifts, and live music.",
    price: 5499,
    category: "valentine's day",
    includes: ['100 Roses Setup', 'Candlelight Dinner Décor', 'Premium Cake', 'Personalized Gift', 'Live Music', 'Fairy Lights'],
    duration: '4-5 hours'
  },

  // Mother's Day
  {
    name: "Mother's Day Special",
    description: "Show mom how much she means with a beautiful flower arrangement, a heartfelt card, her favorite cake, and a pampering gift hamper.",
    price: 1499,
    category: "mother's day",
    includes: ['Flower Arrangement', 'Heartfelt Card', 'Favorite Cake', 'Pampering Gift Hamper', 'Balloon Bouquet'],
    duration: '2-3 hours'
  },
  {
    name: "Mother's Day Royal",
    description: "Treat mom like a queen with premium floral decorations, a spa gift set, customized cake, a memory video, and a surprise breakfast-in-bed setup.",
    price: 3499,
    category: "mother's day",
    includes: ['Premium Floral Décor', 'Spa Gift Set', 'Custom Cake', 'Memory Video', 'Breakfast Setup', 'Photo Frame'],
    duration: '3-4 hours'
  },

  // Father's Day
  {
    name: "Father's Day Classic",
    description: "Celebrate dad with a stylish setup, his favorite cake, a personalized mug, a heartfelt message display, and a grooming kit.",
    price: 1499,
    category: "father's day",
    includes: ['Themed Decoration', 'Favorite Cake', 'Personalized Mug', 'Message Display', 'Grooming Kit'],
    duration: '2-3 hours'
  },
  {
    name: "Father's Day Premium",
    description: "Give dad the royal treatment with a premium setup, customized cake, a watch gift box, a memory video, BBQ party arrangement, and live music.",
    price: 3999,
    category: "father's day",
    includes: ['Premium Decoration', 'Custom Cake', 'Watch Gift Box', 'Memory Video', 'BBQ Setup', 'Live Music'],
    duration: '4-5 hours'
  },

  // Promotion
  {
    name: 'Promotion Party',
    description: 'Celebrate their career milestone with congratulatory decorations, a champagne toast setup, a custom cake, and a success plaque.',
    price: 1999,
    category: 'promotion',
    includes: ['Congratulatory Décor', 'Champagne Setup', 'Custom Cake', 'Success Plaque', 'Balloon Bouquet'],
    duration: '2-3 hours'
  },
  {
    name: 'Promotion Grand Bash',
    description: 'A grand celebration for the big promotion with premium decorations, a party setup, custom cake, photo booth, confetti show, and gift hamper.',
    price: 4499,
    category: 'promotion',
    includes: ['Premium Party Décor', 'Custom Cake', 'Photo Booth', 'Confetti Show', 'Gift Hamper', 'DJ Setup'],
    duration: '4-5 hours'
  },

  // Farewell (adding packages if missing)
  {
    name: 'Farewell Memories',
    description: 'Bid a heartfelt goodbye with a memory lane setup, farewell cake, group photo arrangement, and a personalized farewell card.',
    price: 1799,
    category: 'farewell',
    includes: ['Memory Lane Setup', 'Farewell Cake', 'Group Photo Arrangement', 'Farewell Card', 'Balloon Décor'],
    duration: '2-3 hours'
  },
  {
    name: 'Farewell Grand Send-off',
    description: 'A grand farewell event with premium decorations, a custom cake, video montage of memories, live streaming, and a keepsake gift.',
    price: 3999,
    category: 'farewell',
    includes: ['Grand Decoration', 'Custom Cake', 'Memory Video', 'Live Streaming', 'Keepsake Gift', 'Photo Booth'],
    duration: '4-5 hours'
  }
];

async function seedPackages() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check existing categories
    const existingPackages = await Package.find({});
    const existingCategories = [...new Set(existingPackages.map(p => p.category))];
    console.log(`📦 Existing categories: ${existingCategories.join(', ') || 'none'}`);

    // Filter out packages for categories that already have entries
    const newPackages = occasionPackages.filter(pkg => {
      const catCount = existingPackages.filter(ep => ep.category === pkg.category).length;
      return catCount < 2; // Only add if category has less than 2 packages
    });

    if (newPackages.length === 0) {
      console.log('✨ All occasion packages already exist!');
    } else {
      const result = await Package.insertMany(newPackages);
      console.log(`🎉 Added ${result.length} new occasion packages!`);
      
      // Show summary
      const addedCategories = [...new Set(newPackages.map(p => p.category))];
      addedCategories.forEach(cat => {
        const count = newPackages.filter(p => p.category === cat).length;
        console.log(`   ✦ ${cat}: ${count} packages`);
      });
    }

    // Show final count
    const total = await Package.countDocuments();
    console.log(`\n📊 Total packages in database: ${total}`);
    
    const allCategories = await Package.distinct('category');
    console.log(`📁 All categories: ${allCategories.join(', ')}`);

  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seedPackages();
