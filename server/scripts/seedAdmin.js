const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Reusing User model with role 'admin'
require('dotenv').config({ path: '../.env' });

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    const adminEmail = 'admin@wishwings.in';
    const adminPassword = 'Admin@123';

    // Check if admin exists
    const existingAdmin = await User.findOne({ email: adminEmail, role: 'admin' });
    if (existingAdmin) {
      console.log('Admin already exists.');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    await User.create({
      fullName: 'Wish Wings Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      phone: '0000000000',
      country: 'India'
    });

    console.log('Admin account created successfully!');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedAdmin();
