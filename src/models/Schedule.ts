
import mongoose, { Schema, Document } from 'mongoose';

// Schedule frequency type
export type ScheduleFrequency = 'daily' | 'weekly' | 'monthly' | 'custom';

// Schedule status type
export type ScheduleStatus = 'active' | 'paused' | 'completed' | 'draft';

// Schedule interface
export interface ISchedule extends Document {
  name: string;
  description?: string;
  formId: string;
  formName: string;
  frequency: ScheduleFrequency;
  startDate: Date;
  endDate?: Date;
  status: ScheduleStatus;
  recipients: string[];
  lastSent?: Date;
  nextSend?: Date;
  createdAt: Date;
  createdBy: string;
}

// Schedule schema
const scheduleSchema = new Schema<ISchedule>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  formId: {
    type: String,
    required: true,
  },
  formName: {
    type: String,
    required: true,
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'custom'],
    default: 'weekly',
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'completed', 'draft'],
    default: 'draft',
  },
  recipients: {
    type: [String],
    default: [],
  },
  lastSent: {
    type: Date,
  },
  nextSend: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: String,
    required: true,
  },
});

// Create and export the model
export const Schedule = mongoose.models.Schedule || mongoose.model<ISchedule>('Schedule', scheduleSchema);
