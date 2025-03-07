
import mongoose, { Schema, Document } from 'mongoose';

// Response interface
export interface IResponse extends Document {
  formId: string;
  data: Record<string, any>;
  submittedAt: Date;
  submittedBy?: string;
  ipAddress?: string;
}

// Response schema
const responseSchema = new Schema<IResponse>({
  formId: {
    type: String,
    required: true,
  },
  data: {
    type: Schema.Types.Mixed,
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  submittedBy: {
    type: String,
  },
  ipAddress: {
    type: String,
  },
});

// Create and export the model
export const Response = mongoose.models.Response || mongoose.model<IResponse>('Response', responseSchema);
