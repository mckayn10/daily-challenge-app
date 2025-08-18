import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  level: number;
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  challengesCompleted: number;
  lastChallengeDate?: Date;
  achievements: string[];
  joinedAt: Date;
}

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    default: 1
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  challengesCompleted: {
    type: Number,
    default: 0
  },
  lastChallengeDate: {
    type: Date
  },
  achievements: [{
    type: String
  }],
  joinedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);