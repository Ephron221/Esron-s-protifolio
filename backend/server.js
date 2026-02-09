const app = require('./src/app');
const connectDB = require('./src/config/db');
const User = require('./src/models/User');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 5000;

// Temporary script to reset admin password and ensure user exists
const setupAdmin = async () => {
  try {
    const email = 'esront21@gmail.com';
    // CHANGE THIS to your actual password before running
    const password = 'Diano221%';
    
    let admin = await User.findOne({ email });
    
    if (!admin) {
      console.log('Creating initial admin user...');
      await User.create({
        name: 'Esron Admin',
        email,
        password,
        role: 'admin'
      });
      console.log('Admin user created successfully.');
    } else {
      console.log('Admin user found. Updating password to ensure match...');
      admin.password = password;
      await admin.save();
      console.log('Admin password updated.');
    }
  } catch (error) {
    console.error('Database setup error:', error.message);
  }
};

const startServer = async () => {
  try {
    // 1. Connect to Database first
    await connectDB();
    
    // 2. Setup Admin
    await setupAdmin();

    // 3. Start Listening
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
