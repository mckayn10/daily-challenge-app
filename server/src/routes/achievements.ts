import express from 'express';
import Achievement from '../models/Achievement';
import User from '../models/User';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Initialize default achievements if they don't exist
const initializeAchievements = async () => {
  try {
    const count = await Achievement.countDocuments();
    if (count === 0) {
      const defaultAchievements = [
        {
          id: 'first_steps',
          name: 'First Steps',
          description: 'Complete your first challenge',
          icon: '👶',
          condition: { type: 'challenges_completed', value: 1 },
          points: 10
        },
        {
          id: 'streak_starter',
          name: 'Streak Starter',
          description: 'Maintain a 3-day streak',
          icon: '🔥',
          condition: { type: 'streak', value: 3 },
          points: 25
        },
        {
          id: 'week_warrior',
          name: 'Week Warrior',
          description: 'Maintain a 7-day streak',
          icon: '⚔️',
          condition: { type: 'streak', value: 7 },
          points: 50
        },
        {
          id: 'photo_enthusiast',
          name: 'Photo Enthusiast',
          description: 'Complete 10 photo challenges',
          icon: '📸',
          condition: { type: 'category_completed', value: 10, category: 'photo' },
          points: 30
        },
        {
          id: 'century_club',
          name: 'Century Club',
          description: 'Earn 100 total points',
          icon: '💯',
          condition: { type: 'points', value: 100 },
          points: 50
        },
        {
          id: 'fitness_fanatic',
          name: 'Fitness Fanatic',
          description: 'Complete 5 fitness challenges',
          icon: '💪',
          condition: { type: 'category_completed', value: 5, category: 'fitness' },
          points: 25
        },
        {
          id: 'mindful_master',
          name: 'Mindful Master',
          description: 'Complete 5 mindfulness challenges',
          icon: '🧘',
          condition: { type: 'category_completed', value: 5, category: 'mindfulness' },
          points: 25
        },
        {
          id: 'challenge_champion',
          name: 'Challenge Champion',
          description: 'Complete 25 challenges',
          icon: '🏆',
          condition: { type: 'challenges_completed', value: 25 },
          points: 100
        }
      ];

      await Achievement.insertMany(defaultAchievements);
      console.log('Default achievements initialized');
    }
  } catch (error) {
    console.error('Error initializing achievements:', error);
  }
};

// Initialize achievements on module load
initializeAchievements();

// Get all achievements with user's unlock status
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const user = req.user!;
    const allAchievements = await Achievement.find().sort({ points: 1 });

    const achievementsWithStatus = allAchievements.map(achievement => ({
      id: achievement.id,
      name: achievement.name,
      description: achievement.description,
      icon: achievement.icon,
      points: achievement.points,
      condition: achievement.condition,
      unlocked: user.achievements.includes(achievement.id),
      unlockedAt: user.achievements.includes(achievement.id) ? new Date().toISOString() : null
    }));

    res.json(achievementsWithStatus);
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Check and unlock achievements for a user
export const checkAndUnlockAchievements = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const allAchievements = await Achievement.find();
    const newUnlocks: string[] = [];

    for (const achievement of allAchievements) {
      // Skip if already unlocked
      if (user.achievements.includes(achievement.id)) {
        continue;
      }

      let shouldUnlock = false;

      switch (achievement.condition.type) {
        case 'challenges_completed':
          shouldUnlock = user.challengesCompleted >= achievement.condition.value;
          break;
        case 'streak':
          shouldUnlock = user.currentStreak >= achievement.condition.value || user.longestStreak >= achievement.condition.value;
          break;
        case 'points':
          shouldUnlock = user.totalPoints >= achievement.condition.value;
          break;
        case 'category_completed':
          // For now, we'll implement this as a simple count
          // In a full implementation, you'd track category-specific completions
          shouldUnlock = user.challengesCompleted >= achievement.condition.value;
          break;
      }

      if (shouldUnlock) {
        user.achievements.push(achievement.id);
        user.totalPoints += achievement.points;
        newUnlocks.push(achievement.id);
      }
    }

    if (newUnlocks.length > 0) {
      await user.save();
      console.log(`User ${user.name} unlocked achievements: ${newUnlocks.join(', ')}`);
    }

    return newUnlocks;
  } catch (error) {
    console.error('Error checking achievements:', error);
    return [];
  }
};

export default router;