
import mongoose, { Schema, Document } from 'mongoose';

// Form status type
export type FormStatus = 'active' | 'draft' | 'archived';

// Form interface
export interface IForm extends Document {
  title: string;
  description?: string;
  fields: any[]; // In a real app, this would be more structured
  status: FormStatus;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  submissions: number;
  lastSubmission?: Date;
}

// Form schema
const formSchema = new Schema<IForm>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  fields: {
    type: [],
    default: [],
  },
  status: {
    type: String,
    enum: ['active', 'draft', 'archived'],
    default: 'draft',
  },
  createdBy: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  submissions: {
    type: Number,
    default: 0,
  },
  lastSubmission: {
    type: Date,
  },
});

// Create and export the model
export const Form = mongoose.models.Form || mongoose.model<IForm>('Form', formSchema);
