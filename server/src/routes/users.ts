import express from 'express';
import User from '../models/User';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

router.get('/leaderboard', async (req, res) => {
  try {
    const { sortBy = 'points' } = req.query;
    
    let sortField = {};
    if (sortBy === 'streak') {
      sortField = { currentStreak: -1, totalPoints: -1 };
    } else {
      sortField = { totalPoints: -1, currentStreak: -1 };
    }

    const users = await User.find()
      .select('name totalPoints currentStreak challengesCompleted level')
      .sort(sortField)
      .limit(50);

    if (users.length === 0) {
      const mockUsers = [
        {
          _id: '1',
          name: 'Challenge Master',
          totalPoints: 450,
          currentStreak: 12,
          challengesCompleted: 32,
          level: 8
        },
        {
          _id: '2',
          name: 'Photo Pro',
          totalPoints: 380,
          currentStreak: 8,
          challengesCompleted: 28,
          level: 7
        },
        {
          _id: '3',
          name: 'Fitness Guru',
          totalPoints: 320,
          currentStreak: 15,
          challengesCompleted: 24,
          level: 6
        }
      ];
      
      let sortedUsers = [...mockUsers];
      if (sortBy === 'streak') {
        sortedUsers.sort((a, b) => b.currentStreak - a.currentStreak);
      } else {
        sortedUsers.sort((a, b) => b.totalPoints - a.totalPoints);
      }
      
      return res.json(sortedUsers);
    }

    res.json(users);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/profile', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const user = req.user!;
    
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      level: user.level,
      totalPoints: user.totalPoints,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      challengesCompleted: user.challengesCompleted,
      achievements: user.achievements,
      joinedAt: user.joinedAt
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id/stats', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('totalPoints currentStreak longestStreak challengesCompleted level achievements');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;