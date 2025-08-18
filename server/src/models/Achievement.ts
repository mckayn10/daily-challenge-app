import mongoose, { Document, Schema } from 'mongoose';

export interface IAchievement extends Document {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: {
    type: 'streak' | 'challenges_completed' | 'points' | 'category_completed';
    value: number;
    category?: string;
  };
  points: number;
}

const AchievementSchema: Schema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  condition: {
    type: {
      type: String,
      enum: ['streak', 'challenges_completed', 'points', 'category_completed'],
      required: true
    },
    value: {
      type: Number,
      required: true
    },
    category: {
      type: String
    }
  },
  points: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model<IAchievement>('Achievement', AchievementSchema);