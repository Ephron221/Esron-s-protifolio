const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  // Use DB_MODE from env, default to 'local' if not set
  const mode = process.env.DB_MODE || 'local';
  
  const dbUri = mode === 'atlas' 
    ? process.env.MONGO_ATLAS_URI 
    : process.env.MONGO_LOCAL_URI;

  if (!dbUri) {
    console.error(`Error: MongoDB URI for mode "${mode}" is not defined in .env file.`);
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(dbUri);
    console.log(`MongoDB Connected (${mode}): ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to ${mode} database: ${error.message}`);
    
    // If Atlas fails, we don't automatically fall back to local to avoid data confusion,
    // but we give a clear error message.
    if (mode === 'local') {
      console.log('TIP: Make sure your local MongoDB service is running (mongod).');
    }
    
    process.exit(1);
  }
};

module.exports = connectDB;
