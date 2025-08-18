import express from 'express';
import Submission from '../models/Submission';
import User from '../models/User';
import Challenge from '../models/Challenge';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { checkAndUnlockAchievements } from './achievements';

const router = express.Router();

// Submit a challenge
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { challengeId, description } = req.body;
    const user = req.user!;

    if (!challengeId) {
      return res.status(400).json({ message: 'Challenge ID is required' });
    }

    if (!description || description.trim() === '') {
      return res.status(400).json({ message: 'Description is required' });
    }

    // Check if challenge exists
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    // Check if user already submitted for this challenge
    const existingSubmission = await Submission.findOne({
      userId: user._id,
      challengeId: challengeId
    });

    if (existingSubmission) {
      return res.status(400).json({ message: 'You have already submitted for this challenge today' });
    }

    // Create submission
    const submission = new Submission({
      userId: user._id,
      challengeId: challengeId,
      description: description || '',
      status: 'approved', // Auto-approve for now
      upvotes: 1, // Self-vote
      downvotes: 0
    });

    await submission.save();

    // Update user stats
    user.challengesCompleted += 1;
    user.totalPoints += challenge.points;

    // Update streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastChallenge = user.lastChallengeDate;
    if (lastChallenge) {
      const lastChallengeDate = new Date(lastChallenge);
      lastChallengeDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((today.getTime() - lastChallengeDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        // Consecutive day - continue streak
        user.currentStreak += 1;
        if (user.currentStreak > user.longestStreak) {
          user.longestStreak = user.currentStreak;
        }
      } else if (daysDiff > 1) {
        // Streak broken - reset
        user.currentStreak = 1;
      }
      // daysDiff === 0 means multiple submissions same day, don't change streak
    } else {
      // First challenge ever
      user.currentStreak = 1;
      user.longestStreak = 1;
    }

    user.lastChallengeDate = today;

    // Update level based on total points
    const newLevel = Math.floor(user.totalPoints / 100) + 1;
    user.level = newLevel;

    await user.save();

    // Check and unlock achievements
    await checkAndUnlockAchievements((user._id as any).toString());

    res.json({
      message: 'Challenge submitted successfully!',
      points: challenge.points,
      newStats: {
        totalPoints: user.totalPoints,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        challengesCompleted: user.challengesCompleted,
        level: user.level
      }
    });

  } catch (error) {
    console.error('Error submitting challenge:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's submissions
router.get('/my-submissions', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const user = req.user!;
    
    const submissions = await Submission.find({ userId: user._id })
      .populate('challengeId')
      .sort({ submittedAt: -1 })
      .limit(10);

    res.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;