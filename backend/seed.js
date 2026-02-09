const mongoose = require('mongoose');
const User = require('./src/models/User');
const dotenv = require('dotenv');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Remove the old incorrect user if it exists
    await User.deleteOne({ email: 'esront21@gamil.com' });
    
    // Check if the correct user already exists
    const userExists = await User.findOne({ email: 'esront21@gmail.com' });
    
    if (userExists) {
      // Update password just in case
      userExists.password = 'Diano21%';
      await userExists.save();
      console.log('Admin user updated with correct email (gmail.com).');
    } else {
      const admin = new User({
        name: 'Esron',
        email: 'esront21@gmail.com',
        password: 'Diano21%',
        role: 'admin'
      });
      await admin.save();
      console.log('Admin user created successfully with correct email (gmail.com)!');
    }

    console.log('Email: esront21@gmail.com');
    console.log('Password: Diano21%');
    
    process.exit();
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
