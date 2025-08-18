import express from 'express';
import Challenge from '../models/Challenge';

const router = express.Router();

router.get('/today', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let challenge = await Challenge.findOne({
      date: today,
      isActive: true
    });

    if (!challenge) {
      const challengeTemplates = [
        {
          title: 'Nature Photography',
          description: 'Take a photo of something beautiful in nature near you. This could be a flower, tree, sunset, or any natural scene that catches your eye.',
          category: 'photo',
          difficulty: 'easy',
          points: 10,
          requirements: [
            'Photo must be taken today',
            'Should feature natural elements',
            'Original content only'
          ]
        },
        {
          title: '10-Minute Walk',
          description: 'Take a brisk 10-minute walk outside. Fresh air and movement are great for both physical and mental health.',
          category: 'fitness',
          difficulty: 'easy',
          points: 15,
          requirements: [
            'Walk must be at least 10 minutes',
            'Share a photo of your route or destination',
            'Document your experience'
          ]
        },
        {
          title: 'Gratitude Journal',
          description: 'Write down 3 things you are grateful for today. Practicing gratitude has been shown to improve mental wellbeing.',
          category: 'mindfulness',
          difficulty: 'easy',
          points: 12,
          requirements: [
            'List exactly 3 items',
            'Be specific and personal',
            'Explain why each item matters to you'
          ]
        },
        {
          title: 'Learn Something New',
          description: 'Spend 15 minutes learning about a topic you\'ve always been curious about.',
          category: 'learning',
          difficulty: 'medium',
          points: 18,
          requirements: [
            'Choose a topic you know little about',
            'Spend at least 15 minutes learning',
            'Share one interesting fact you discovered'
          ]
        },
        {
          title: 'Creative Writing',
          description: 'Write a short story or poem in exactly 100 words.',
          category: 'creative',
          difficulty: 'medium',
          points: 20,
          requirements: [
            'Must be exactly 100 words',
            'Any genre is acceptable',
            'Original content only'
          ]
        },
        {
          title: 'Random Act of Kindness',
          description: 'Perform a small act of kindness for someone without expecting anything in return.',
          category: 'mindfulness',
          difficulty: 'easy',
          points: 15,
          requirements: [
            'Must be for someone else',
            'Can be anonymous',
            'Share the impact it had (if any)'
          ]
        }
      ];

      const randomTemplate = challengeTemplates[Math.floor(Math.random() * challengeTemplates.length)];
      
      try {
        challenge = new Challenge({
          ...randomTemplate,
          date: today,
          isActive: true
        });
        await challenge.save();
      } catch (dbError) {
        console.error('Database error, using mock data:', dbError);
        return res.json({ ...randomTemplate, _id: Date.now().toString(), date: today, isActive: true });
      }
    }

    res.json(challenge);
  } catch (error) {
    console.error('Error fetching today\'s challenge:', error);
    
    const fallbackChallenge = {
      _id: Date.now().toString(),
      title: 'Gratitude Moment',
      description: 'Take a moment to think about something you\'re grateful for today.',
      category: 'mindfulness',
      difficulty: 'easy',
      points: 10,
      requirements: ['Spend 2 minutes in gratitude'],
      date: new Date(),
      isActive: true
    };
    
    res.json(fallbackChallenge);
  }
});

router.get('/', async (req, res) => {
  try {
    const challenges = await Challenge.find({ isActive: true })
      .sort({ date: -1 })
      .limit(10);
    
    res.json(challenges);
  } catch (error) {
    console.error('Error fetching challenges:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;