
import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from '@/context/AuthContext';

// User interface
export interface IUser extends Document {
  email: string;
  name: string;
  role: UserRole;
  password: string; // In a real app, this should be hashed
  createdAt: Date;
}

// User schema
const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.VIEWER,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the model
export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
