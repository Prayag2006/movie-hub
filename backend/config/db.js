const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  try {
    let mongoURI = process.env.MONGO_URI;

    try {
      // Try connecting to the provided URI first
      const conn = await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 2000 });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
      console.log('Local MongoDB not found. Starting in-memory database...');
      const mongoServer = await MongoMemoryServer.create();
      mongoURI = mongoServer.getUri();
      const conn = await mongoose.connect(mongoURI);
      console.log(`In-memory MongoDB Connected: ${conn.connection.host}`);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;



