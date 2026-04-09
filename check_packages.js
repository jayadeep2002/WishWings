const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'server', '.env') });

const PackageSchema = new mongoose.Schema({
  category: String
});
const Package = mongoose.model('Package', PackageSchema);

async function checkPackages() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/wishWings';
    await mongoose.connect(mongoUri);
    const stats = await Package.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    console.log(JSON.stringify(stats, null, 2));
    await mongoose.connection.close();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkPackages();
