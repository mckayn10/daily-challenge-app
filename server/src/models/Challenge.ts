import mongoose, { Document, Schema } from 'mongoose';

export interface IChallenge extends Document {
  title: string;
  description: string;
  category: 'photo' | 'fitness' | 'creative' | 'learning' | 'mindfulness' | 'coding';
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  requirements: string[];
  date: Date;
  isActive: boolean;
}

const ChallengeSchema: Schema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['photo', 'fitness', 'creative', 'learning', 'mindfulness', 'coding'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  points: {
    type: Number,
    required: true
  },
  requirements: [{
    type: String
  }],
  date: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IChallenge>('Challenge', ChallengeSchema);