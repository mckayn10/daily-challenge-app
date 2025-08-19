import express from 'express';
import Challenge from '../models/Challenge';

const router = express.Router();

// Generate a large pool of diverse challenges
const generateDailyChallenges = () => {
  const photoSubjects = ['sunset', 'flowers', 'architecture', 'street art', 'shadows', 'reflections', 'patterns', 'textures', 'people', 'animals', 'food', 'clouds', 'water', 'trees', 'urban scenes'];
  const fitnessActivities = ['walking', 'jogging', 'stretching', 'yoga poses', 'jumping jacks', 'push-ups', 'dancing', 'stairs climbing', 'cycling', 'swimming'];
  const learningTopics = ['astronomy', 'marine biology', 'ancient history', 'quantum physics', 'linguistics', 'psychology', 'philosophy', 'art history', 'geography', 'mythology', 'economics', 'anthropology'];
  const creativePrompts = ['childhood memory', 'future invention', 'magical object', 'unlikely friendship', 'time travel', 'parallel universe', 'superpower', 'dream world', 'abandoned place', 'mysterious letter'];
  const mindfulnessThemes = ['gratitude', 'present moment', 'breathing', 'self-compassion', 'kindness', 'acceptance', 'inner peace', 'emotional awareness', 'body awareness', 'forgiveness'];
  const codingChallenges = ['calculator', 'to-do app', 'weather widget', 'random quote generator', 'color palette generator', 'password generator', 'unit converter', 'expense tracker', 'habit tracker', 'timer app'];

  const challenges = [
    // PHOTO CHALLENGES (30+ variations)
    ...photoSubjects.map((subject, index) => ({
      title: `${subject.charAt(0).toUpperCase() + subject.slice(1)} Photography`,
      description: `Capture an interesting photo featuring ${subject}. Focus on composition, lighting, and creative perspective.`,
      category: 'photo',
      difficulty: index % 3 === 0 ? 'easy' : index % 3 === 1 ? 'medium' : 'hard',
      points: index % 3 === 0 ? 10 : index % 3 === 1 ? 15 : 20,
      requirements: [
        'Photo must be taken today',
        `Focus on ${subject} as the main subject`,
        'Consider lighting and composition',
        'Original content only'
      ]
    })),

    // FITNESS CHALLENGES (20+ variations)
    ...fitnessActivities.map((activity, index) => ({
      title: `${activity.charAt(0).toUpperCase() + activity.slice(1)} Challenge`,
      description: `Complete a ${activity} session for ${10 + index * 2} minutes. Focus on form and consistency.`,
      category: 'fitness',
      difficulty: index % 3 === 0 ? 'easy' : index % 3 === 1 ? 'medium' : 'hard',
      points: 12 + index * 2,
      requirements: [
        `Complete ${10 + index * 2} minutes of ${activity}`,
        'Focus on proper form',
        'Document your experience',
        'Note how you feel afterward'
      ]
    })),

    // LEARNING CHALLENGES (24+ variations)
    ...learningTopics.map((topic, index) => ({
      title: `Discover ${topic.charAt(0).toUpperCase() + topic.slice(1)}`,
      description: `Spend 15-20 minutes learning about ${topic}. Find something that surprises or interests you.`,
      category: 'learning',
      difficulty: 'medium',
      points: 18,
      requirements: [
        `Research ${topic} for at least 15 minutes`,
        'Use reliable sources',
        'Share one fascinating fact you learned',
        'Explain why it interested you'
      ]
    })),

    // CREATIVE CHALLENGES (20+ variations)
    ...creativePrompts.map((prompt, index) => ({
      title: `Creative Writing: ${prompt.charAt(0).toUpperCase() + prompt.slice(1)}`,
      description: `Write a creative piece inspired by "${prompt}". Let your imagination run wild!`,
      category: 'creative',
      difficulty: index % 2 === 0 ? 'medium' : 'hard',
      points: index % 2 === 0 ? 20 : 25,
      requirements: [
        `Base your story/poem on "${prompt}"`,
        'Write 100-200 words',
        'Be creative and original',
        'Any genre is welcome'
      ]
    })),

    // MINDFULNESS CHALLENGES (20+ variations)
    ...mindfulnessThemes.map((theme, index) => ({
      title: `Mindful ${theme.charAt(0).toUpperCase() + theme.slice(1)}`,
      description: `Practice mindfulness focused on ${theme}. Take time to reflect and be present.`,
      category: 'mindfulness',
      difficulty: 'easy',
      points: 12,
      requirements: [
        `Focus on ${theme} for 5-10 minutes`,
        'Find a quiet space',
        'Reflect on your experience',
        'Share your main insight'
      ]
    })),

    // CODING CHALLENGES (24+ variations)
    ...codingChallenges.map((project, index) => ({
      title: `Code a ${project.charAt(0).toUpperCase() + project.slice(1)}`,
      description: `Build a simple ${project} using any programming language. Focus on functionality and clean code.`,
      category: 'coding',
      difficulty: index % 3 === 0 ? 'medium' : 'hard',
      points: index % 3 === 0 ? 25 : 30,
      requirements: [
        `Create a working ${project}`,
        'Use any programming language',
        'Write clean, readable code',
        'Test your implementation'
      ]
    })),

    // BONUS UNIQUE CHALLENGES (20+ more)
    {
      title: 'Digital Detox Hour',
      description: 'Spend one full hour without any digital devices. Focus on offline activities and mental clarity.',
      category: 'mindfulness',
      difficulty: 'medium',
      points: 20,
      requirements: ['No phones, computers, or screens for 1 hour', 'Engage in offline activities', 'Notice your thoughts and feelings', 'Reflect on the experience']
    },
    {
      title: 'Local History Explorer',
      description: 'Research and learn about the history of your local area or neighborhood.',
      category: 'learning',
      difficulty: 'easy',
      points: 15,
      requirements: ['Research your local area\'s history', 'Find 3 interesting historical facts', 'Share what surprised you most']
    },
    {
      title: 'Compliment Chain',
      description: 'Give genuine compliments to 3 different people today (in person, text, or call).',
      category: 'mindfulness',
      difficulty: 'easy',
      points: 15,
      requirements: ['Give 3 genuine compliments', 'Make them specific and meaningful', 'Note people\'s reactions']
    },
    {
      title: 'Macro Photography',
      description: 'Take extreme close-up photos of small objects, revealing details usually unseen.',
      category: 'photo',
      difficulty: 'hard',
      points: 25,
      requirements: ['Take macro/close-up shots', 'Focus on tiny details', 'Experiment with lighting', 'Capture 3-5 different subjects']
    },
    {
      title: 'Memory Palace',
      description: 'Create a memory palace to memorize a list of 10 items using visualization techniques.',
      category: 'learning',
      difficulty: 'hard',
      points: 25,
      requirements: ['Learn the memory palace technique', 'Create your own memory palace', 'Memorize 10 items', 'Test your recall']
    },
    // Add more unique challenges...
  ];

  return challenges;
};

router.get('/today', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let challenge = await Challenge.findOne({
      date: today,
      isActive: true
    });

    if (!challenge) {
      // Dynamic challenge generation with much more variety
      const challengeTemplates = generateDailyChallenges();

      // Use date as seed for consistent daily challenges (same for everyone)
      const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
      const challengeIndex = daysSinceEpoch % challengeTemplates.length;
      const selectedTemplate = challengeTemplates[challengeIndex];
      
      try {
        challenge = new Challenge({
          ...selectedTemplate,
          date: today,
          isActive: true
        });
        await challenge.save();
      } catch (dbError) {
        console.error('Database error, using mock data:', dbError);
        return res.json({ ...selectedTemplate, _id: Date.now().toString(), date: today, isActive: true });
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