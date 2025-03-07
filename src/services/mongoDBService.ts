
import mongoose from 'mongoose';

// MongoDB connection string - provided by the user
const MONGODB_URI = 'mongodb+srv://rajeshvaris:ZW8zRQXQHlMIjDA1@formbuildercluster.e7gnk.mongodb.net/FormBuilderDB';

// Check if we're running in a browser environment
const isBrowser = typeof window !== 'undefined';

// Mock connection state for browser environment
let mockConnectionState = 0; // 0 = disconnected, 1 = connected

// Function to connect to MongoDB
export const connectDB = async () => {
  // In browser environment, we can't use mongoose directly
  if (isBrowser) {
    console.log('Browser environment detected, using mock MongoDB connection');
    mockConnectionState = 1;
    return;
  }

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
  if (isBrowser) {
    mockConnectionState = 0;
    console.log('Mock MongoDB disconnected successfully');
    return;
  }

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
  if (isBrowser) {
    if (mockConnectionState === 0) {
      await connectDB();
    }
    return;
  }

  if (mongoose.connection.readyState === 0) {
    await connectDB();
  }
};

// Helper to check connection status (for both real and mock connections)
export const isConnected = () => {
  if (isBrowser) {
    return mockConnectionState >= 1;
  }
  return mongoose.connection.readyState >= 1;
};
