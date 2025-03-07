
import mongoose from 'mongoose';

// MongoDB connection string - in a real app, this should be in an environment variable
const MONGODB_URI = 'mongodb://localhost:27017/formflow';

// Function to connect to MongoDB
export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    throw error;
  }
};

// Function to disconnect from MongoDB
export const disconnectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    return;
  }

  try {
    await mongoose.disconnect();
    console.log('MongoDB disconnected successfully');
  } catch (error) {
    console.error('MongoDB disconnection failed:', error);
    throw error;
  }
};

// Ensure MongoDB is connected before any database operation
export const ensureDBConnected = async () => {
  if (mongoose.connection.readyState === 0) {
    await connectDB();
  }
};
