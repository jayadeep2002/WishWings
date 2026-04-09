const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'server', '.env') });

const PackageSchema = new mongoose.Schema({
  name: String,
  category: String
});
const Package = mongoose.model('Package', PackageSchema);

async function verifySeeding() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/wishwings';
    console.log(`📡 Connecting to: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    const stats = await Package.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    console.log('\n📊 Package Distribution by Category:');
    console.log('-----------------------------------');
    stats.forEach(stat => {
      console.log(`${stat._id.padEnd(20)} : ${stat.count} packages`);
    });

    const total = await Package.countDocuments();
    console.log('-----------------------------------');
    console.log(`Total Packages       : ${total}`);

    await mongoose.connection.close();
  } catch (err) {
    console.error('❌ Verification failed:', err.message);
    process.exit(1);
  }
}

verifySeeding();
