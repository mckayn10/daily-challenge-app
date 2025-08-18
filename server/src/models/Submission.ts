import mongoose, { Document, Schema } from 'mongoose';

export interface ISubmission extends Document {
  userId: mongoose.Types.ObjectId;
  challengeId: mongoose.Types.ObjectId;
  fileUrl?: string;
  description?: string;
  status: 'pending' | 'approved' | 'rejected';
  votes: {
    userId: mongoose.Types.ObjectId;
    vote: 'up' | 'down';
  }[];
  upvotes: number;
  downvotes: number;
  submittedAt: Date;
}

const SubmissionSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  challengeId: {
    type: Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true
  },
  fileUrl: {
    type: String
  },
  description: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  votes: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    vote: {
      type: String,
      enum: ['up', 'down']
    }
  }],
  upvotes: {
    type: Number,
    default: 0
  },
  downvotes: {
    type: Number,
    default: 0
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model<ISubmission>('Submission', SubmissionSchema);